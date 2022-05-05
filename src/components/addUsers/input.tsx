import { useRef, useState } from 'react'

export default function Input({
  callback,
  placeholder,
  disabled = false,
  clearAfterInput = false
}: {
  callback: (name: string) => void
  placeholder: string
  disabled?: boolean
  clearAfterInput?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>()
  const [empty, setEmpty] = useState(true)

  return (
    <div className="mt-1 w-auto relative rounded-md shadow-sm flex justify-evenly">
      <input
        type="text"
        className="bg-gray-600 w-64 p-2 rounded-md"
        placeholder={placeholder}
        ref={inputRef}
        onChange={val => {
          if (val.target.value.length > 0) return setEmpty(false)
          setEmpty(true)
        }}
        disabled={disabled}
      />

      <button
        className={`py-2 px-4 rounded-md duration-150 ${empty || disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600'}`}
        disabled={empty || disabled}
        onClick={() => {
          callback(inputRef.current.value)
          if (clearAfterInput) inputRef.current.value = ''
        }}
      >
        Submit
      </button>
    </div>
  )
}
