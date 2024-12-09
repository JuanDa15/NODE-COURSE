import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)

export const paginator = (page, quantity = 2, data) => {
  const start = (page - 1) * quantity
  const end = page * quantity
  return data.slice(start, end)
}
