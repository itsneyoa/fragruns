import { ReactNode } from 'react'

export default function Box({ children, title, button }: { children: ReactNode; title: string; button?: () => void }) {
  return (
    <div className="mt-6 w-96 h-80 rounded-xl border p-6 pt-4 text-left flex flex-col">
      <span className="flex justify-between pb-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        {button && (
          <button className="bg-gray-800 px-2 rounded-full" onClick={button}>
            Add
          </button>
        )}
      </span>
      {children}
    </div>
  )
}
