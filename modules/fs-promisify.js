const fs = require('node:fs');
const { promisify } = require('node:util');

const readFilePromise = promisify(fs.readFile);

const text = fs.readFileSync('./note.txt', {
  encoding: 'utf-8',
});

console.log(text);

console.log('do this ASAP');

readFilePromise('./note.txt', { encoding: 'utf-8' })
  .then((text) => console.log(text))
  .catch((err) => console.error(err));
