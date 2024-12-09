import { paginator, readJSON } from '../helper.js'
import { randomUUID } from 'node:crypto'
// /movies
const movies = readJSON('./movies.json')

export class MovieModel {
  static async getAll ({ genre, page }) {
    let moviesToReturn = movies
    if (genre) {
      moviesToReturn = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    }

    if (page) {
      moviesToReturn = paginator(page, 2, moviesToReturn)
    }

    return moviesToReturn
  }

  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create ({ input }) {
    const newMovie = {
      ...input,
      id: randomUUID()
    }

    movies.push(newMovie)
    return newMovie
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return false
    }

    movies.splice(movieIndex, 1)
    return true
  }

  static async update ({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return false
    }

    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input
    }
    return movies[movieIndex]
  }
}
