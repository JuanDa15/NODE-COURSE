const os = require('node:os');

// Convert bytes to kb, mb, gb
const kb = (bytes) => bytes / 1024;
const mb = (bytes) => kb(bytes) / 1024;
const gb = (bytes) => mb(bytes) / 1024;

const min = (seconds) => seconds / 60;
const hours = (seconds) => min(seconds) / 60;

console.log('OS Information:');
console.log('----------------');

const data = {
  'System End of line': os.EOL,
  'OS architecture': os.arch(),
  'OS Parallelism': os.availableParallelism(),
  'OS free memory': `${gb(os.freemem()).toFixed(2)} GB`,
  'OS total memory': `${gb(os.totalmem()).toFixed(2)} GB`,
  'OS home dir': os.homedir(),
  'OS hostname': os.hostname(),
  'OS platform': os.platform(),
  'OS release': os.release(),
  'OS temporal dir': os.tmpdir(),
  'OS type': os.type(),
  'OS uptime': `${hours(os.uptime()).toFixed(2)} hours`,
  'OS version': os.version(),
};

console.table(data);
console.log('----------------');
console.log('CPU Information:');
console.log('----------------');
console.table(os.cpus());
console.log('----------------');
console.log('Network Information:');
console.log('----------------');
console.log(os.networkInterfaces());
console.log('----------------');
console.log('User Information:');
console.log('----------------');
console.table(os.userInfo());
// console.dir(os.constants);
