const fs = require('node:fs/promises');

const text = fs.readFileSync('./note.txt', {
  encoding: 'utf-8',
});

console.log(text);

console.log('do this ASAP');

fs.readFile('./note.txt', { encoding: 'utf-8' })
  .then((text) => console.log(text))
  .catch((err) => console.error(err));
