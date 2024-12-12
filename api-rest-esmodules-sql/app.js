import express from 'express'
import { createMovieRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'

// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

export const createApp = ({ movieModel }) => {
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

  app.use('/movies', createMovieRouter({ movieModel }))

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}
