import type { IncomingMessage } from 'http'
import type { Socket as ioClient } from 'socket.io-client'
import type { Server as ioServer } from 'socket.io'
import type { Bot } from 'mineflayer'

export const dev = process.env.NODE_ENV !== 'production'
export const publicMode = process.env.BOT_MODE !== 'private'

export interface ApiRequest extends IncomingMessage {
  bot: Bot
}

export interface ServerToClientEvents {
  code: (code: string | undefined) => void
  logs: (logs: string[]) => void
  online: (status: boolean) => void
  username: (username: string) => void
  queue: (queue: string[]) => void
  allowed: (users: string[]) => void
  banned: (users: string[]) => void
  public: (publicMode: boolean) => void
  apiKey: (key: string) => void
}

export interface ClientToServerEvents {
  allow: (...users: string[]) => void
  unallow: (...users: string[]) => void
  ban: (...users: string[]) => void
  unban: (...users: string[]) => void
  refreshApiKey: () => void
}

export type SocketClient = ioClient<ServerToClientEvents, ClientToServerEvents>
export type SocketServer = ioServer<ClientToServerEvents, ServerToClientEvents>
