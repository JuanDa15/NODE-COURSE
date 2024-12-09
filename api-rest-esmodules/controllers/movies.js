import { MovieModel } from '../models/movie-local.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MoviesController {
  static async getAll (req, res) {
    const { genre, page } = req.query
    const moviesToReturn = await MovieModel.getAll({ genre, page })
    res.json(moviesToReturn)
  }

  static async create (req, res) {
    const result = validateMovie(req.body)
    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const movie = await MovieModel.create({
      input: result.data
    })

    return res.status(201).json({
      message: 'Movie created successfully',
      data: movie
    })
  }

  static async update (req, res) {
    const { id } = req.params
    const result = validatePartialMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updated = await MovieModel.update({ id, input: result.data })

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

  static async replace (req, res) {
    const { id } = req.params

    const result = validateMovie(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const updated = await MovieModel.update({ id, input: result.data })

    if (!updated) {
      const newMovie = await MovieModel.create(result.data)
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

  static async delete (req, res) {
    const { id } = req.params

    const deleted = await MovieModel.delete({ id })

    if (!deleted) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    return res.status(200).json({
      success: true,
      message: 'Movie deleted successfully'
    })
  }

  static async getById (req, res) {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'No movie id provided' })
    }

    const movie = await MovieModel.getById({ id })

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' })
    }

    return res.status(200).json(movie)
  }

  static async options (req, res) {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.sendStatus(200)
  }
}
