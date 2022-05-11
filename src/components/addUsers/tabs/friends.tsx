import { useState } from 'react'
import { resolveIgnFromUUIDs } from '..'
import Input from '../input'
import List from '../list'

export default function FriendTab({ apiKey, callback, refreshApiKey }: { apiKey?: string; callback: (names: string[]) => void; refreshApiKey: () => void }) {
  const [data, setData] = useState<string[] | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [disabled, setDisabled] = useState(false)

  return (
    <>
      <Input
        placeholder="Username"
        callback={async name => {
          setDisabled(true)
          setData(undefined)
          setError(undefined)

          const uuid = await uuidFromUsername(name)

          if (!uuid) {
            setError('Invalid username')
            setDisabled(false)
          }

          const data = (await (await fetch(`https://api.hypixel.net/friends?uuid=${uuid}&key=${apiKey}`)).json()) as Response

          if (data.success && data.uuid && data.records?.length) {
            const list = [...data.records.map(({ uuidReceiver }) => uuidReceiver), ...data.records.map(({ uuidSender }) => uuidSender)]
              .filter(Boolean)
              .filter(element => element.replace(/-/g, '') != uuid.replace(/-/g, ''))
            setData(await resolveIgnFromUUIDs(list))
          } else {
            setError(data.cause ?? 'No friends found')
            if (data.cause == 'Invalid API key') refreshApiKey()
          }

          setDisabled(false)
        }}
        disabled={disabled}
      />

      <List
        data={data}
        error={error}
        callback={names => {
          setError(undefined)
          callback(names)
        }}
      />
    </>
  )
}

async function uuidFromUsername(username: string): Promise<string> {
  return (await (await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`)).json()).uuid
}

interface Response {
  success: boolean
  cause?: string
  uuid?: string
  records?: Record[]
}

type Record = {
  _id: string
  uuidSender: string
  uuidReceiver: string
  started: number
}
