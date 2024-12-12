import { Router } from 'express'
import { MoviesController } from '../controllers/movies.js'

export const createMovieRouter = ({ movieModel }) => {
  const moviesRouter = Router()

  const controller = new MoviesController({ movieModel })

  moviesRouter.get('/', controller.getAll)

  moviesRouter.post('/', controller.create)

  moviesRouter.patch('/:id', controller.update)

  moviesRouter.put('/:id', controller.replace)

  moviesRouter.delete('/:id', controller.delete)

  moviesRouter.get('/:id', controller.getById)

  moviesRouter.options('/:id', controller.options)

  return moviesRouter
}
