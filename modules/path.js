const path = require('node:path');

console.log(path.sep);

const filePath = path.join('/content', 'subfolder', 'test.txt');
console.log(filePath);

const base = path.basename(filePath);
console.log(base);

const base2 = path.basename(filePath, '.txt');
console.log(base2);

const extension = path.extname('photo.img');
console.log(extension);
