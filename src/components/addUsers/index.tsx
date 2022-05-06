import { Dispatch, SetStateAction } from 'react'
import { Dialog, Tab } from '@headlessui/react'
import TabButton from './tab'
import GuildTab from './tabs/guild'
import FriendTab from './tabs/friends'
import ManualTab from './tabs/manual'
import ClearTab from './tabs/clear'

export default function AddUsers({
  open,
  setOpen,
  title,
  callback,
  apiKey,
  refreshApiKey
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  callback: (data: string[]) => void
  apiKey?: string
  refreshApiKey: () => void
}) {
  const tabs = [
    {
      title: 'Guild',
      background: 'bg-green-600',
      content: <GuildTab apiKey={apiKey} callback={callback} refreshApiKey={refreshApiKey} />
    },
    {
      title: 'Friends',
      background: 'bg-orange-400',
      content: <FriendTab apiKey={apiKey} callback={callback} refreshApiKey={refreshApiKey} />
    },
    {
      title: 'Manual',
      background: 'bg-fuchsia-700',
      content: <ManualTab callback={callback} />
    },
    {
      title: 'Clear',
      background: 'bg-red-600',
      content: <ClearTab callback={callback} />
    }
  ]

  return (
    <Dialog className="relative z-10" onClose={() => setOpen(false)} open={open}>
      <div className="fixed inset-0 text-white bg-gray-500 opacity-90" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all text-white">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-center">
              {title}
            </Dialog.Title>

            <div className="w-full max-w-md py-2">
              <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-700 p-1">
                  {tabs.map(tab => (
                    <TabButton title={tab.title} background={tab.background} key={tab.title} />
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                  {tabs.map(({ content, title }) => {
                    return (
                      <Tab.Panel key={title} className="rounded-xl bg-gray-700 p-3">
                        {content}
                      </Tab.Panel>
                    )
                  })}
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

export async function resolveIgnFromUUIDs(uuids: string[]): Promise<string[]> {
  return (
    await Promise.all(
      uuids.map(async uuid => {
        return (await (await fetch(`https://api.ashcon.app/mojang/v2/user/${uuid}`)).json()).username
      })
    )
  ).sort()
}
