import { useState } from 'react'
import { resolveIgnFromUUIDs } from '..'
import Input from '../input'
import List from '../list'

export default function GuildTab({ apiKey, callback, refreshApiKey }: { apiKey: string; callback: (names: string[]) => void; refreshApiKey: () => void }) {
  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const [disabled, setDisabled] = useState(false)

  return (
    <>
      <Input
        placeholder="Guild Name"
        callback={async name => {
          setDisabled(true)
          setData(undefined)

          const data = await (await fetch(`https://api.hypixel.net/guild?name=${name}&key=${apiKey}`)).json()

          if (data.success && data.guild?.members) {
            setData(await resolveIgnFromUUIDs(data.guild.members.map(({ uuid }) => uuid)))
          } else {
            setError(data.cause ?? 'No guild members found')
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
