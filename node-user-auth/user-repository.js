import { randomUUID } from 'node:crypto'

import DBlocal from 'db-local'

import { LogRepository } from './log-repository.js'
import { SALT_ROUNDS } from './config.js'
import { Validation } from './validation.js'
import { compare, hash } from 'bcrypt'

const { Schema } = new DBlocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (user) throw new Error('User already exists')

    const id = randomUUID()

    const hashedPassword = await hash(password, SALT_ROUNDS)

    try {
      User.create({
        _id: id,
        username,
        password: hashedPassword,
        created_at: new Date().toLocaleString()
      }).save()

      return id
    } catch (error) {
      LogRepository.create({
        message: error.message,
        module: 'UserRepository',
        data: JSON.stringify({ username, password }),
        url: '/register',
        method: 'POST'
      })
      throw new Error('Error creating user')
    }
  }

  static async login ({ username, password }) {
    Validation.username(username)
    Validation.password(password)

    const user = User.findOne({ username })
    if (!user) throw new Error('Invalid credentials')

    const isValid = await compare(password, user.password)

    if (!isValid) throw new Error('Invalid credentials')

    const { password: _, ...data } = user
    return data
  }
}
