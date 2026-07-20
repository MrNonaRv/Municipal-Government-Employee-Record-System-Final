const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');
code = code.replace('size: A4;', 'size: letter;');
fs.writeFileSync('src/index.css', code);
