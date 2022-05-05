import { ReactNode } from 'react'

export default function Error({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="grid place-content-center min-h-screen w-full text-center">
      <h1 className="text-gray-50 text-4xl">{title}</h1>
      {children}
    </div>
  )
}
