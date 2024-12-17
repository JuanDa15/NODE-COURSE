export class Validation {
  static username (username) {
    if (typeof username !== 'string') {
      throw new Error('username must be a string')
    }
    if (username.length < 3) {
      throw new Error('username must be at least 3 characters')
    }
  }

  static password (password) {
    if (typeof password !== 'string') {
      throw new Error('password must be a string')
    }
    if (password.length < 8) {
      throw new Error('password must be at least 8 characters')
    }
  }
}
