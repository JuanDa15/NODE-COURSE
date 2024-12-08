const paginator = (page, quantity = 2, data) => {
  const start = (page - 1) * quantity
  const end = page * quantity
  return data.slice(start, end)
}

module.exports = {
  paginator
}
