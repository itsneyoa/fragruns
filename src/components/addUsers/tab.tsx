import { Tab } from '@headlessui/react'

export default function TabButton({ title, background }: { title: string; background: string }) {
  return (
    <Tab
      className={({ selected }) =>
        `w-full rounded-lg py-2.5 text-sm font-medium leading-5 duration-100 ${selected ? `shadow ${background}` : 'text-blue-300 hover:bg-gray-400'}`
      }
    >
      {title}
    </Tab>
  )
}
