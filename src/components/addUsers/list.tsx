import Code from '../code'
import Table from '../table'

export default function List({ data, error, callback }: { data?: string[]; error?: string; callback: (names: string[]) => void }) {
  return (
    <div className="max-h-96 w-96 rounded-xl p-2 pt-4 gap-2 flex flex-col">
      {data && (
        <>
          <Table data={data.map(username => [username])} noTitle />
          <button
            className={`py-2 px-4 rounded-md bg-green-600 hover:bg-green-400 duration-300`}
            onClick={() => {
              callback(data)
            }}
          >
            Confirm
          </button>
        </>
      )}
      {error && (
        <div>
          Data fetching error: <Code>{error}</Code>
        </div>
      )}
    </div>
  )
}
