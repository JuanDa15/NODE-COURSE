const fs = require('node:fs');

const stats = fs.statSync('./note.txt');

console.log(
  stats.isFile(),
  stats.isDirectory(),
  stats.isSymbolicLink(),
  stats.size
);
