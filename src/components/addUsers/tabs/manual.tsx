import { useState } from 'react'
import Input from '../input'
import List from '../list'

export default function ManualTab({ callback }: { callback: (names: string[]) => void }) {
  const [data, setData] = useState<string[]>([])

  return (
    <>
      <Input
        placeholder="Username"
        callback={name => {
          setData(data => [name, ...data])
        }}
        clearAfterInput
      />

      <List data={data} callback={callback} />
    </>
  )
}
