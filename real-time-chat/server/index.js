import express from 'express'
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import { createClient } from '@libsql/client'
import { TURSO_TOKEN, TURSO_URL } from '../env-variables.js'

const port = process.env.PORT || 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2_000
  }
})

// CREATE THE DATABASE IN TURSO

const db = createClient({
  url: TURSO_URL,
  authToken: TURSO_TOKEN
})

await db.execute(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT,
    username TEXT
  );
`)

io.on('connection', async (socket) => {
  socket.on('chat message', async (msg) => {
    let result
    const username = socket.handshake.auth.username
    try {
      result = await db.execute({
        sql: 'INSERT INTO messages (content, username) VALUES (:msg, :username)',
        args: { msg, username }
      })

      const message = await db.execute({
        sql: 'SELECT content, created_at, username, id FROM messages WHERE id = :id',
        args: { id: result.lastInsertRowid }
      })

      io.emit('chat message', {
        msg: message.rows[0]
      })
    } catch (error) {
      console.log(error)
      throw new Error('Error saving message')
    }
  })

  socket.on('disconect', () => {
    console.log('user disconnected')
  })

  if (!socket.recovered) {
    try {
      const result = await db.execute({
        sql: 'SELECT id, content, created_at, username FROM messages WHERE id > :id',
        args: { id: socket.handshake.auth.serverOffset || 0 }
      })
      result.rows.forEach((row) => {
        socket.emit('chat message', {
          msg: {
            ...row
          }
        })
      })
    } catch (error) {
      console.log(error)
      throw new Error('Error recovering messages')
    }
  }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
