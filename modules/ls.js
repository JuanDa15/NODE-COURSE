const fs = require('node:fs/promises')
const path = require('node:path')
const pc = require('picocolors')

const folder = process.argv[2] ?? '.'

async function ls (directory) {
  let files = []
  try {
    files = await fs.readdir(folder)
  } catch (e) {
    console.error(`Error reading directory: ${folder}`)
    process.exit(1)
  }

  const filesPromises = files.map(readFile)

  const filesInfo = await Promise.all(filesPromises)

  filesInfo.forEach((fileInfo) => console.log(fileInfo))
}

async function readFile (file) {
  const filePath = path.join(folder, file)
  let stats
  try {
    stats = await fs.stat(filePath)
    const fileType = stats.isDirectory() ? 'd' : '-'
    const fileSize = stats.size.toString()
    const lastModified = stats.mtime.toLocaleString()
    const isHidden = path.basename(filePath).startsWith('.')

    return `${pc.green(fileType.padEnd(5))} ${
      !isHidden ? pc.blue(file.padEnd(20)) : pc.gray(file.padEnd(20))
    } ${pc.magenta(fileSize.padStart(10))} ${pc.yellow(
      filePath.padEnd(20)
    )} ${lastModified}`
  } catch (e) {
    console.error(`Error reading file: ${filePath}`)
    process.exit(1)
  }
}

ls(folder)
