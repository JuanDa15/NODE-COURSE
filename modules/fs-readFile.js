const fs = require('node:fs');

const text = fs.readFileSync('./note.txt', {
  encoding: 'utf-8',
});

console.log(text);

console.log('do this ASAP');

fs.readFile('./note.txt', { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(data);
});
