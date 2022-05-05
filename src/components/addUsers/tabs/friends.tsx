import { useState } from 'react'
import { resolveIgnFromUUIDs } from '..'
import Input from '../input'
import List from '../list'

export default function FriendTab({ apiKey, callback, refreshApiKey }: { apiKey: string; callback: (names: string[]) => void; refreshApiKey: () => void }) {
  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
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

          const data = await (await fetch(`https://api.hypixel.net/friends?uuid=${uuid}&key=${apiKey}`)).json()

          if (data.success && data.uuid && data.records?.length) {
            const list: string[] = [...data.records.map(({ uuidReceiver }) => uuidReceiver), ...data.records.map(({ uuidSender }) => uuidSender)]
              .filter(Boolean)
              .filter(el => el.replace(/-/g, '') != data.uuid.replace(/-/g, ''))
            setData(await resolveIgnFromUUIDs(list))
          } else {
            setError(data.cause ?? 'No friends found')
            if (data.cause == 'Invalid API key') refreshApiKey()
          }

          setDisabled(false)
        }}
        disabled={disabled}
      />

      <List data={data} error={error} callback={callback} />
    </>
  )
}

async function uuidFromUsername(username: string) {
  return (await (await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`)).json()).uuid
}
