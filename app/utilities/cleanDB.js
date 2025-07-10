import { Stock } from '../models/Stock.js'

export async function cleanDB() {
  await Stock.collection.updateMany(
    { relVariation: /[()]/ },
    [
      {
        $set: {
          relVariation: {
            $replaceAll: {
              input: {
                $replaceAll: {
                  input: '$relVariation',
                  find: '(',
                  replacement: ''
                }
              },
              find: ')',
              replacement: ''
            }
          }
        }
      }
    ]
  )
}
