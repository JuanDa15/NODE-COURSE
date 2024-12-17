import DBlocal from 'db-local'
import { randomUUID } from 'node:crypto'
const { Schema } = new DBlocal({ path: './db' })

const Log = Schema('Log', {
  _id: { type: String, required: true },
  message: { type: String, required: true },
  module: { type: String, required: true },
  data: { type: String, required: false },
  url: { type: String, required: true },
  method: { type: String, required: true },
  created_at: { type: String, required: true }
})

export class LogRepository {
  static create ({ message, module, data, url, method }) {
    try {
      Log.create({
        _id: randomUUID(),
        message,
        module,
        data,
        url,
        method,
        created_at: new Date().toLocaleString()
      }).save()
    } catch (error) {
      throw new Error('Error creating log')
    }
  }
}
