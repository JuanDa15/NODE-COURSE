import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MoviesController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre, page } = req.query
    const moviesToReturn = await this.movieModel.getAll({ genre, page })
    res.json(moviesToReturn)
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const movie = await this.movieModel.create({
      input: result.data
    })

    return res.status(201).json({
      message: 'Movie created successfully',
      data: movie
    })
  }

  update = async (req, res) => {
    const { id } = req.params
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updated = await this.movieModel.update({ id, input: result.data })

    if (!updated) {
      return res.status(404).json({
        error: 'Movie not found'
      })
    }

    return res.status(200).json({
      message: 'Movie updated successfully',
      data: updated
    })
  }

  replace = async (req, res) => {
    const { id } = req.params

    const result = validateMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updated = await this.movieModel.update({ id, input: result.data })

    if (!updated) {
      const newMovie = await this.movieModel.create(result.data)
      return res.status(201).json({
        message: 'Movie created successfully',
        data: newMovie
      })
    }

    return res.status(200).json({
      message: 'Movie updated successfully',
      data: updated
    })
  }

  delete = async (req, res) => {
    const { id } = req.params

    const deleted = await this.movieModel.delete({ id })

    if (!deleted) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    })
  }

  getById = async (req, res) => {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'No movie id provided' })
    }

    const movie = await this.movieModel.getById({ id })

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    return res.status(200).json(movie)
  }

  options = async (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.sendStatus(200)
  }
}
