import { createServer } from 'http'
import next from 'next'
import { ClientToServerEvents, dev, publicMode, ServerToClientEvents } from '../constants'
import { Server as ioserver } from 'socket.io'
import CreateBot from '../minecraft/bot'

export default async function CreateServer() {
  const port = parseInt(process.env.PORT || '3000', 10)
  const app = next({ dev })
  const handle = app.getRequestHandler()

  await app.prepare()

  const server = createServer((req, res) => {
    handle(req, res)
  }).listen(port)

  const io = new ioserver<ClientToServerEvents, ServerToClientEvents>(server)

  CreateBot(io)

  console.log(
    `> Web Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV} for ${publicMode ? 'public' : 'private'} use.`
  )
  return server
}
