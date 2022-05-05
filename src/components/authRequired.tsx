import Code from './code'
import { Dialog } from '@headlessui/react'

export default function AuthRequired({ code }: { code?: string }) {
  return (
    <Dialog className="relative z-10" onClose={() => null} open={!!code}>
      <div className="fixed inset-0 text-white bg-gray-500 opacity-90" />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-red-500 p-6 text-left align-middle shadow-xl transition-all">
            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
              Authentication Required
            </Dialog.Title>
            <div>
              <p className="my-3">
                Login with Microsoft using code <Code colour="bg-red-600">{code}</Code>
              </p>

              <a href="https://www.microsoft.com/link" target="_blank" rel="noreferrer" className="bg-red-600 p-2 rounded-md">
                Go to Microsoft Link ➜
              </a>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}
