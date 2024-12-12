import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://192.168.20.21:8080',
  'http://localhost:3000'
]

export const corsMiddleware = () => cors({
  origin: (origin, callback) => {
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  }
})
