import { ReactNode } from 'react'

export default function Code({ children, colour }: { children: ReactNode; colour?: string }) {
  return <code className={`rounded-md ${colour ?? 'bg-gray-600'} p-2 font-mono select-all`}>{children}</code>
}
