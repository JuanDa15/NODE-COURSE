const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 3000

// STATUS CODES
// 100-199 Respuestas informativas
// 200-299 Respuestas satisfactorias
// 300-399 Redirecciones
// 400-499 Errores cliente
// 500-599 Errores servidor

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  if (req.url === '/') {
    res.statusCode = 200
    res.end('Bienvenido a la página de inicio del API')
    return
  }
  if (req.url === '/contacto') {
    res.statusCode = 200
    res.end('Bienvenido a la página de contacto del API')
    return
  }

  if (req.url === '/imagen.png') {
    fs.readFile('./coffee-mug2.png', (err, data) => {
      if (err) {
        res.statusCode = 500
        res.end('500 Internal Server Error')
      } else {
        res.setHeader('Content-Type', 'image/png')
        res.statusCode = 200
        res.end(data)
      }
    })
    return
  }

  res.statusCode = 404
  res.end('Página no encontrada')
})

server.listen(desiredPort, () => {
  console.log(`server listening on port:${desiredPort}`)
})
