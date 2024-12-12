import mysql from 'mysql2/promise'
import { paginator } from '../helper.js'

const DEFAULT_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'MovieDB'
}

let connection

try {
  connection = await mysql.createConnection(process.env.DATABASE_URL ?? DEFAULT_CONFIG)
} catch (error) {
  console.error('Error connecting to the database')
}

export class MovieModel {
  static async getAll ({ genre, page }) {
    let movies = []
    if (genre) {
      const lowerGenre = genre.toLowerCase()
      const [dbGenres] = await connection.query('SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerGenre])

      if (dbGenres.length === 0) {
        return movies
      }

      const [{ id }] = dbGenres

      const [moviesByGenre] = await connection.query(`
        SELECT BIN_TO_UUID(movie_id) movie_id, genre_id, genre.name genre_name, movie.title, movie.year, movie.rate, movie.poster, movie.duration, movie.director FROM movie_genres JOIN movie ON movie.id = movie_genres.movie_id JOIN genre ON genre.id = movie_genres.genre_id WHERE genre_id = ?;
      `, [id])

      movies = moviesByGenre
    } else {
      const [allMovies] = await connection.query(`
        SELECT BIN_TO_UUID(id) id, title, year, rate, poster, duration, director FROM movie;
      `)
      movies = allMovies
    }

    if (page) {
      movies = paginator(page, 2, movies)
    }

    return movies
  }

  static async getById ({ id }) {
    const [movie] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, rate, poster, duration, director FROM movie WHERE id = UUID_TO_BIN(?)', [id])

    if (movie.length === 0) return null

    const [genres] = await connection.query(`
      SELECT genre.name FROM movie_genres JOIN genre ON genre.id = movie_genres.genre_id JOIN movie ON movie.id = movie_genres.movie_id WHERE movie.id = UUID_TO_BIN(?);
    `, [id])
    movie[0].genres = genres.map(genre => genre.name)

    return movie[0]
  }

  static async create ({ input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate,
      genre
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    await connection.query('INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES(UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);', [uuid, title, year, director, duration, poster, rate])

    genre.forEach(async (genreName) => {
      const [genre] = await connection.query('SELECT id FROM genre WHERE LOWER(name) = ?;', [genreName.toLowerCase()])

      const [{ id }] = genre
      await connection.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES(UUID_TO_BIN(?), ?);', [uuid, id])
    })

    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE UUID_TO_BIN(?) = id', [uuid])

    const [genres] = await connection.query(`
      SELECT genre.name FROM movie_genres JOIN genre ON genre.id = movie_genres.genre_id JOIN movie ON movie.id = movie_genres.movie_id WHERE movie.id = UUID_TO_BIN(?);
    `, [uuid])

    movies[0].genres = genres.map(genre => genre.name)
    return movies[0]
  }

  static async delete ({ id }) {
    try {
      await connection.query('DELETE FROM movie WHERE id = UUID_TO_BIN(?);', [id])
      await connection.query('DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?)', [id])
      return true
    } catch (error) {
      console.error('Error deleting movie from DB')
      return false
    }
  }

  static async update ({ id, input }) {
    const {
      title,
      year,
      director,
      duration,
      poster,
      rate,
      genre = []
    } = input

    let queryString = 'UPDATE movie SET '
    const values = []

    if (title) {
      queryString += 'title = ?, '
      values.push(title)
    }
    if (year) {
      queryString += 'year = ?, '
      values.push(year)
    }
    if (director) {
      queryString += 'director = ?, '
      values.push(director)
    }
    if (duration) {
      queryString += 'duration = ?, '
      values.push(duration)
    }
    if (poster) {
      queryString += 'poster = ?, '
      values.push(poster)
    }
    if (rate) {
      queryString += 'rate = ? '
      values.push(rate)
    }

    queryString += 'WHERE id = UUID_TO_BIN(?);'
    values.push(id)

    await connection.query(queryString, values)

    if (genre.length > 0) {
      await connection.query('DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);', [id])
      genre.forEach(async (genreName) => {
        const [dbGenre] = await connection.query('SELECT id FROM genre WHERE LOWER(name) = ?;', [genreName.toLowerCase()])

        await connection.query('INSERT INTO movie_genres (movie_id, genre_id) VALUES(UUID_TO_BIN(?), ?);', [id, dbGenre[0].id])
      })
    }

    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE UUID_TO_BIN(?) = id', [id])

    const [genres] = await connection.query(`
      SELECT genre.name FROM movie_genres JOIN genre ON genre.id = movie_genres.genre_id JOIN movie ON movie.id = movie_genres.movie_id WHERE movie.id = UUID_TO_BIN(?);
    `, [id])

    movies[0].genres = genres?.map(genre => genre.name)
    return movies[0]
  }
}
