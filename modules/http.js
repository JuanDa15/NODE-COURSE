const http = require('node:http')
const { findAvailablePort } = require('./net')

const desiredPort = process.env.PORT ?? 3000

const server = http.createServer((req, res) => {
  console.log('request receiver')
  res.end('Hola mundo')
})

findAvailablePort(desiredPort).then(port => {
  server.listen(port, () => {
    console.log(`server listening on port:${port}`)
  })
})
