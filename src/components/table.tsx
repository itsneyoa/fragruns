import { ReactFragment } from 'react'

export default function Table({
  headings,
  data,
  numbering = false,
  noTitle = false,
  blank = 'Empty'
}: {
  headings?: string[]
  data: Array<Array<string | ReactFragment>>
  numbering?: boolean
  noTitle?: boolean
  blank?: string
}) {
  let number = 1
  let key = 0
  let rowCounter = 1

  return (
    <div className="rounded-lg overflow-auto">
      <table className="w-full text-sm text-left text-gray-400">
        {headings && (
          <thead className="text-md bg-gray-700">
            {headings.map(heading => {
              return (
                <th scope="col" className="px-6 py-3" key={heading}>
                  {heading}
                </th>
              )
            })}
          </thead>
        )}
        <tbody>
          {!data.length && (
            <tr className="bg-gray-800 border-gray-700">
              <td className="text-center py-4">{blank}</td>
            </tr>
          )}
          {data.map(row => {
            let titled = noTitle
            return (
              <tr className={`bg-gray-800 border-gray-700 ${rowCounter < data.length && rowCounter++ && 'border-b'}`} key={key}>
                {numbering && (
                  <th scope="row" className="px-6 py-4 font-medium text-white">
                    {(titled = true) && number++}
                  </th>
                )}
                {row.map(item => {
                  return (
                    <td className={`px-6 py-4 ${!titled && 'font-medium text-white'}`} key={key++}>
                      {(titled = true) && item}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
