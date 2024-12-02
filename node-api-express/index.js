const express = require('express')
const ditto = require('./pokemon/ditto.json')
const app = express()
app.disable('x-powered-by')
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`)
  next()
})

// app.use((req, res, next) => {
//   if (req.method === 'GET') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()

//   let body = ''

//   req.on('data', (chunk) => {
//     body += chunk.toString()
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)
//     req.body = data
//     next()
//   })
// })

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World'
  })
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/pokemon', (req, res) => {
  const body = req.body
  res.status(201).json({
    ...body,
    timestamp: new Date().toISOString()
  })
})
// SHOULD BE AT THE END
app.use((req, res) => {
  res.status(404).json({
    message: 'Not found'
  })
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
