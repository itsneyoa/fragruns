import { useState } from 'react'

export default function ClearTab({ callback }: { callback: (names: string[]) => void }) {
  const [cleared, setCleared] = useState(false)

  return (
    <div className="flex justify-center">
      <button
        className={`py-2 px-4 rounded-md duration-150 ${cleared ? 'bg-green-400' : 'bg-red-600 hover:bg-red-500'}`}
        disabled={cleared}
        onClick={() => {
          setCleared(true)
          callback([])
        }}
      >
        {cleared ? 'List cleared!' : 'Click here to remove all users'}
      </button>
    </div>
  )
}
