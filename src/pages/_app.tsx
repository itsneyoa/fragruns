import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import ioclient from 'socket.io-client'
import type { SocketClient } from '../constants'

export default function App({ Component, pageProps }: AppProps) {
  const [socket, setSocket] = useState<SocketClient | undefined>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const socket: SocketClient = ioclient()
    setSocket(socket)

    return function () {
      socket?.disconnect()
      setSocket(undefined)
    }
  }, [])

  return (
    <>
      <Head>
        <meta name="title" content="Fragruns" />
      </Head>
      <main className="grid justify-center min-h-screen bg-gray-900 text-white">
        <Component {...pageProps} socket={socket} />
      </main>
    </>
  )
}
