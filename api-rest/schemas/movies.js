const z = require('zod')

const schema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi'], {
      invalid_type_error: 'Movie genre must be an array of enum Genre',
      required_error: 'Movie genre is required'
    })
  )
})

function validateMovie (shape) {
  return schema.safeParse(shape)
}

function validatePartialMovie (shape) {
  return schema.partial().safeParse(shape)
}

module.exports = { validateMovie, validatePartialMovie }
