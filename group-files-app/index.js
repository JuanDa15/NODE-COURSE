const fs = require('node:fs/promises')
const path = require('node:path')

const folder = process.argv[2] ?? '.'

const FOLDER_NAME_BY_EXT = {
  '.png': 'Images',
  '.jpeg': 'Images',
  '.jpg': 'Images',
  '.mp3': 'Audio',
  '.mp4': 'Video',
  '.txt': 'Text',
  '.pdf': 'PDF',
  '.docx': 'Word',
  '.doc': 'Word',
  '.xlsx': 'Excel',
  '.pptx': 'PowerPoint',
  '.webp': 'Images'
}

console.log(folder)

async function ls (directory) {
  try {
    return await fs.readdir(directory)
  } catch {
    throw Error(`Error reading directory: ${directory}`)
  }
};

function getFolderExtensions (files) {
  const extensions = files.map(file => {
    return path.extname(file)
  })
  return Array.from(new Set(extensions))
}

function getFolderName (ext) {
  return FOLDER_NAME_BY_EXT[ext] ?? 'Other'
}

async function createFolder (ext) {
  const folderName = getFolderName(ext)
  const folderPath = path.join(folder, folderName)

  try {
    await fs.mkdir(folderPath, { recursive: true })
  } catch {
    throw Error(`Error creating folder: ${folderPath}`)
  }
}

async function moveFile (file, folderName) {
  const filePath = path.join(folder, file)
  const folderPath = path.join(folder, folderName)
  const newFilePath = path.join(folderPath, file)

  try {
    console.log(`Moving file: ${filePath} to ${newFilePath}`)
    await fs.rename(filePath, newFilePath)
    console.log(`File moved: ${filePath} to ${newFilePath}`)
  } catch {
    throw Error(`Error moving file: ${filePath}`)
  }
}

(async () => {
  console.log('Reading folder files...')
  const files = await ls(folder)

  console.log('Creating folders...')
  const extensions = getFolderExtensions(files)

  extensions.forEach(async (ext) => await createFolder(ext))

  console.log('Moving files...')

  files.forEach(async (file) => {
    const filePath = path.join(folder, file)
    const ext = path.extname(file)
    let fileStat = null
    try {
      fileStat = await fs.stat(filePath)
    } catch {
      throw Error(`Error reading file: ${filePath}`)
    }

    if (!fileStat) return
    if (fileStat.isDirectory()) return

    await moveFile(file, getFolderName(ext))
  })
  console.log('Done!')
})()
