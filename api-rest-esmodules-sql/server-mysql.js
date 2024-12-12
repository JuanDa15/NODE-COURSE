import { createApp } from './app.js'
import { MovieModel } from './models/movie-sql.js'

createApp({ movieModel: MovieModel })
