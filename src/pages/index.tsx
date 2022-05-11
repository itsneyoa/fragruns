import { SocketClient } from '../constants'
import Box from '../components/box'
import Table from '../components/table'
import { useState, useEffect } from 'react'
import Code from '../components/code'
import AuthRequired from '../components/authRequired'
import Error from '../components/error'
import AddUsers from '../components/addUsers'

interface PageProps {
  socket?: SocketClient
}

export default function Home({ socket }: PageProps) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<string | undefined>()
  const [online, setOnline] = useState(false)
  const [messageStack, setMessageStack] = useState<string[]>([])
  const [queue, setQueue] = useState<string[]>([])
  const [authCode, setAuthCode] = useState<string | undefined>()
  const [allowed, setAllowed] = useState<string[]>([])
  const [banned, setBanned] = useState<string[]>([])
  const [publicMode, setPublicMode] = useState(true)
  const [allowedAddGui, setAllowedAddGui] = useState(false)
  const [bannedAddGui, setBannedAddGui] = useState(false)
  const [apiKey, setApiKey] = useState<string | undefined>()

  useEffect(() => {
    if (!socket) return

    socket.on('online', setOnline)
    socket.on('code', setAuthCode)
    socket.on('logs', setMessageStack)
    socket.on('username', setUsername)
    socket.on('queue', setQueue)
    socket.on('allowed', setAllowed)
    socket.on('banned', setBanned)
    socket.on('public', setPublicMode)
    socket.on('apiKey', setApiKey)

    return function cleanup() {
      socket.removeAllListeners()
    }
  }, [socket])

  useEffect(() => {
    if (socket && !socket.disconnected) setLoading(false)
  }, [socket, socket?.disconnected])

  if (loading) return <Error title="Loading..." />

  if (!socket) return <Error title="Socket not found" />
  if (socket.disconnected) return <Error title="Socket disconnected" />

  return (
    <div className="grid place-content-between min-h-screen w-full text-center">
      <div>
        <h1 className="text-6xl font-bold">Fragruns!</h1>

        <p className={`mt-5 text-lg ${!username && 'invisible'} ${online ? 'select-all' : 'select-none cursor-not-allowed'}`}>
          <Code>/p {username}</Code>
        </p>
      </div>

      <main>
        <AuthRequired code={online ? undefined : authCode} />
        <div className="flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <Box title="⚡ Current Queue">
            <Table data={queue.map(item => [item])} numbering />
          </Box>

          <Box title={`${online ? '🟢' : '🔴'} Bot logs`}>
            <Table data={messageStack.map(log => [log])} noTitle blank="No logs yet!" />
          </Box>

          <Box title="✅ Allowed users" button={publicMode ? undefined : () => setAllowedAddGui(true)}>
            {!publicMode && (
              <AddUsers
                open={allowedAddGui}
                setOpen={setAllowedAddGui}
                title="Allow users"
                callback={data => {
                  socket.emit('allow', ...data)
                  setAllowedAddGui(false)
                }}
                apiKey={apiKey}
                refreshApiKey={refreshApiKey}
              />
            )}
            <Table
              data={allowed.sort().map(item =>
                publicMode
                  ? [item]
                  : [
                      item,
                      <button key={item} onClick={() => socket.emit('unallow', item)} className="text-blue-400">
                        Remove
                      </button>
                    ]
              )}
              blank="All users are allowed!"
            />
          </Box>

          <Box title="❌ Banned users" button={publicMode ? undefined : () => setBannedAddGui(true)}>
            {!publicMode && (
              <AddUsers
                open={bannedAddGui}
                setOpen={setBannedAddGui}
                title="Ban users"
                callback={data => {
                  socket.emit('ban', ...data)
                  setBannedAddGui(false)
                }}
                apiKey={apiKey}
                refreshApiKey={refreshApiKey}
              />
            )}
            <Table
              data={banned.sort().map(item =>
                publicMode
                  ? [item]
                  : [
                      item,
                      <button key={item} onClick={() => socket.emit('unban', item)} className="text-blue-400">
                        Remove
                      </button>
                    ]
              )}
              blank="Nobody is banned!"
            />
          </Box>
        </div>
      </main>

      <footer className="flex p-1 w-full items-center justify-center">
        <span>
          Created by{' '}
          <a href="https://neyoa.me" target="_blank" rel="noopener noreferrer" className="text-[#ccff00]">
            neyoa
          </a>
          . Check out the source code on{' '}
          <a href="https://github.com/itsneyoa/fragruns" target="_blank" rel="noopener noreferrer" className="text-[#ccff00]">
            GitHub
          </a>
          !
        </span>
      </footer>
    </div>
  )

  function refreshApiKey() {
    return socket.emit('refreshApiKey')
  }
}
