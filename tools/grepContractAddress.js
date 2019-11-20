const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', line => {
  line = line.trim();
  const parts = line.split('KPS:');

  if (parts.length > 1) {
    console.log(parts[1].trim())
  }
});
