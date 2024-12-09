import { Router } from 'express'
import { MoviesController } from '../controllers/movies.js'

export const moviesRouter = Router()

moviesRouter.get('/', MoviesController.getAll)

moviesRouter.post('/', MoviesController.create)

moviesRouter.patch('/:id', MoviesController.update)

moviesRouter.put('/:id', MoviesController.replace)

moviesRouter.delete('/:id', MoviesController.delete)

moviesRouter.get('/:id', MoviesController.getById)

moviesRouter.options('/:id', MoviesController.options)
