import express from 'express'
import { moviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'

// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

const port = process.env.PORT || 3000

const app = express()

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(express.json())

// Safe methods: GET, HEAD, POST, OPTIONS
// Unsafe/complex methods: PATCH, PUT, DELETE
// Unsafe/complex methods has something called CORS-PREFLIGHT

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/movies', moviesRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
