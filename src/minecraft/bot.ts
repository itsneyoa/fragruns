import { createBot, Bot } from 'mineflayer'
import { publicMode, SocketServer } from '../constants'
import { dev } from '../constants'
import Stack from '../stack'
import Storage from '../storage'

export default function CreateBot(io: SocketServer): Bot {
  const queue: string[] = []
  const commandStack: string[] = []
  const logStack = new Stack(50)
  let code: string | undefined
  let online = false
  let isQueueLooping = false
  let currentLeader: string | undefined = undefined

  const regex = [
    {
      /* Party invite (normal) */
      exp: /^-+\s(?:\[.*?\] )?([a-zA-Z0-9_]+) has invited you to join their party! You have 60 seconds to accept\. Click here to join!\s-+$/,
      exec: (match: RegExpMatchArray) => onPartyInvite(match.splice(1).pop())
    },
    {
      /* Party leave */
      exp: /^-+\sYou left the party\s-+$/,
      exec: () => onPartyLeave()
    },
    {
      /* Party join confirmation */
      exp: /^-+\sYou have joined (?:\[.*?\] )?([a-zA-Z0-9_]+)'s party\s-+$/,
      exec: (match: RegExpMatchArray) => onPartyJoin(match.splice(1).pop())
    },
    {
      /* Kicked from party */
      exp: /^-+\sYou have been kicked from the party by (?:\[.*?\] )?([a-zA-Z0-9_]+)\s-+$/,
      exec: () => onPartyLeave()
    },
    {
      /* Invited to join a different players party */
      exp: /^-+\s(?:\[.*?\] )?([a-zA-Z0-9_]+) has invited you to join (?:\[.*?\] )?([a-zA-Z0-9_]+)'s party! You have 60 seconds to accept\. Click here to join!\s-+$/,
      exec: (match: RegExpMatchArray) => onPartyInvite(match.splice(1).pop())
    },
    {
      /* Party disbanded manually */
      exp: /^-+\s(?:\[.*?\] )?([a-zA-Z0-9_]+) has disbanded the party!\s-+$/,
      exec: () => onPartyLeave()
    },
    {
      /* Leader disconnected */
      exp: /^-+\sThe party leader, (?:\[.*?\] )?([a-zA-Z0-9_]+) has disconnected, they have 5 minutes to rejoin before the party is disbanded\.\s-+$/,
      exec: () => null // Does nothing at the moment
    },
    {
      /* Party disbanded by disconnect */
      exp: /^-+\sThe party was disbanded because the party leader disconnected\.\s-+$/,
      exec: () => onPartyLeave()
    },
    {
      /* Party disbanded by all members disconnecting */
      exp: /^-+\sThe party was disbanded because all invites expired and and the party was empty\s-+$/,
      exec: () => onPartyLeave()
    },
    {
      /* Api key update */
      exp: /^Your new API key is (\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/,
      exec: (match: RegExpMatchArray) => onApiKeyUpdate(match.splice(1).pop())
    }
  ]

  setInterval(() => {
    const command = commandStack.shift()
    if (command) {
      bot.chat(command)
    }
  }, 100) // Can try lower values

  const bot = createBot({
    username: 'Fragruns',
    auth: dev ? undefined : 'microsoft',
    onMsaCode: ({ user_code }) => {
      code = user_code
      io.emit('code', code)
    },
    defaultChatPatterns: false,
    host: dev ? 'localhost' : 'mc.hypixel.net',
    profilesFolder: './.minecraft'
  })

  bot.on('login', () => {
    online = true
    code = undefined
    io.emit('online', online)
    io.emit('code', code)

    if (!Storage.apiKey) {
      refreshApiKey()
    }
  })

  bot.on('end', reason => {
    online = false
    io.emit('online', online)
    io.emit('logs', logStack.add(`Disconnected: ${reason}`))
  })

  io.on('connection', socket => {
    socket.emit('online', online)
    socket.emit('logs', logStack.stack)
    socket.emit('username', bot.username)
    socket.emit('code', code)
    socket.emit('allowed', [...Storage.allowed])
    socket.emit('banned', [...Storage.banned])
    socket.emit('public', publicMode)
    Storage.apiKey && socket.emit('apiKey', Storage.apiKey)

    if (!publicMode) {
      socket.on('allow', (...users) => {
        if (users.length == 0) Storage.allowed.clear()

        users.forEach(username => {
          Storage.allow(username)
        })

        io.emit('allowed', [...Storage.allowed])
      })

      socket.on('unallow', (...users) => {
        users.forEach(username => {
          Storage.unallow(username)
        })

        io.emit('allowed', [...Storage.allowed])
      })

      socket.on('ban', (...users) => {
        if (users.length == 0) Storage.banned.clear()

        users.forEach(username => {
          Storage.ban(username)
        })

        io.emit('banned', [...Storage.banned])
      })

      socket.on('unban', (...users) => {
        users.forEach(username => {
          Storage.unban(username)
        })

        io.emit('banned', [...Storage.banned])
      })

      socket.on('refreshApiKey', () => refreshApiKey)
    }
  })

  bot.on('messagestr', message => {
    io.emit('logs', logStack.add(message.replace(/\s?-+\s?/g, '')))

    for (const { exp, exec } of regex) {
      const match = message.match(exp)

      if (match) {
        return exec(match)
      }
    }
  })

  async function onPartyInvite(username?: string) {
    if (!username) return

    const allowed = Storage.isAllowed(username)

    if (!allowed) {
      return io.emit('logs', logStack.add(`Decline invite from ${username}`))
    }

    queue.push(username)
    io.emit('queue', queue)

    if (!isQueueLooping) {
      const user = queue[0]
      if (user) {
        isQueueLooping = true
        acceptInvite(user)
      }
    }
  }

  function onPartyJoin(leader?: string) {
    currentLeader = leader
    queue.shift()
    io.emit('queue', queue)

    setTimeout(() => {
      if (currentLeader == leader) {
        commandStack.push(`/p leave`)
      }
    }, 5000)
  }

  function onPartyLeave() {
    const user = queue[0]
    currentLeader = undefined
    if (user) {
      isQueueLooping = true
      acceptInvite(user)
    } else {
      isQueueLooping = false
    }
  }

  function acceptInvite(username: string) {
    commandStack.push(`/p accept ${username}`)
  }

  function refreshApiKey() {
    commandStack.push('/api new')
  }

  function onApiKeyUpdate(key?: string) {
    if (key) {
      Storage.apiKey = key
      io.emit('apiKey', Storage.apiKey)
    }
  }

  return bot
}
