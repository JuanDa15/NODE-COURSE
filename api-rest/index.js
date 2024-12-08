const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { paginator } = require('./helper')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const cors = require('cors')
const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://192.168.20.21:8080',
  'http://localhost:3000'
]

const port = process.env.PORT || 3000

const app = express()
app.disable('x-powered-by')

// Safe methods: GET, HEAD, POST, OPTIONS
// UNSAFE methods: PATCH, PUT, DELETE

app.use(express.json())

app.use(cors({
  origin: (origin, callback) => {
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
}))
// CORS MIDDLEWARE BUILT-IN BY ME
// app.use((req, res, next) => {
//   const origin = req.header('origin')

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//   }

//   next()
// })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/movies', (req, res) => {
  const { genre, page } = req.query

  let moviesToReturn = movies

  if (genre) {
    moviesToReturn = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
  }

  if (page) {
    moviesToReturn = paginator(page, 2, moviesToReturn)
  }

  res.json(moviesToReturn)
})

// The POST method is used to create a new resource. It's not idempotent.
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const movie = {
    ...result.data,
    id: crypto.randomUUID()
  }

  movies.push(movie)

  return res.status(201).json({
    message: 'Movie created successfully',
    data: movie
  })
})

// The PATCH method is used to apply partial modifications to a resource. It's idempotent in some cases, but not always, depending on the implementation of the schema in the database, if we had a database field like createdAt, it wouldn't be idempotent.
app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({
      error: 'Movie not found'
    })
  }

  movies[movieIndex] = {
    ...movies[movieIndex],
    ...result.data
  }

  return res.status(200).json({
    message: 'Movie updated successfully',
    data: movies[movieIndex]
  })
})

// The PUT method should work as a replacement of the entire resource or entity, or a creation of a new resource if it doesn't exist. It's idempotent.
app.put('/movies/:id', (req, res) => {
  const { id } = req.params

  const result = validateMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    const newMovie = {
      ...result.data,
      id: crypto.randomUUID()
    }

    movies.push(newMovie)
    return res.status(201).json({
      message: 'Movie created successfully',
      data: newMovie
    })
  }

  movies[movieIndex] = {
    ...movies[movieIndex],
    ...result.data
  }

  return res.status(200).json({
    message: 'Movie updated successfully',
    data: movies[movieIndex]
  })
})

// The DELETE method is used to delete a resource identified by a URI. It's idempotent.
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params

  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.status(200).json({
    success: true,
    message: 'Movie deleted successfully'
  })
})

// The GET method is used to retrieve a representation of a resource identified by a URI. It's idempotent.
app.get('/movies/:id', (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).json({ error: 'No movie id provided' })
  }

  const movie = movies.find(movie => movie.id === id)

  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  return res.status(200).json(movie)
})

app.options('/movies/:id', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
  res.sendStatus(200)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
