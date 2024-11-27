console.log(process.argv);

// Good
// process.exit(0)
// When error
// process.exit(1)

process.on('exit', () => {
  // Clean up code
  console.log('Process ended');
});

// Current working directory
console.log(process.cwd());

// Env variables
console.log(process.env.NODE_ENV);
