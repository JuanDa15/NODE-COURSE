const http = require('node:http')
const dittoJSON = require('./pokemon/ditto.json')

const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH'
}

const processRequest = (req, res) => {
  const { method, url } = req
  switch (method) {
    case HTTP_METHODS.GET:
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          return res.end(JSON.stringify(dittoJSON))
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          return res.end('Not found')
      }
    case HTTP_METHODS.POST:
      switch (url) {
        case '/pokemon': {
          let body = ''

          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
            const parsedBody = JSON.parse(body)
            parsedBody.timestamp = Date.now()
            res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
            res.end(JSON.stringify(parsedBody))
          })
          break
        }
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain; charset=utf-8')
          return res.end('Not found')
      }
      break
    default:
      res.statusCode = 404
      res.setHeader('Content-Type', 'text/plain; charset=utf-8')
      return res.end('Metodo no permitido')
  }
}

const server = http.createServer(processRequest)

server.listen('3000', () => {
  console.log('server listening on port 3000')
})
