import express from 'express'
import cors from 'cors'
import { PORT, SECRET } from './config.js'
import { UserRepository } from './user-repository.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors())
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  const token = req.cookies['access-token']
  let data = null

  req.session = { user: null }

  try {
    data = jwt.verify(token, SECRET)
    req.session.user = data
  } catch (error) {
    req.session.user = null
  }
  next()
})

app.get('/', (req, res) => {
  const { user } = req.session
  console.log(user)
  res.render('index', user)
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({
      id: user._id,
      username: user.username
    }, SECRET, { expiresIn: '1h' })
    return res.cookie('access-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60
    }).json({
      message: 'User logged in successfully',
      data: user
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    const id = await UserRepository.create({ username, password })

    res.json({
      message: 'User created successfully',
      data: {
        id, username
      }
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
})

app.post('/logout', (req, res) => {
  res.clearCookie('access-token').render('index', { username: null })
})

app.get('/protected', (req, res) => {
  const { user } = req.session

  if (!user) return res.status(401).json({ message: 'Unauthorized' })

  res.render('protected', user)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
