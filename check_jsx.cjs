const fs = require('fs');
const code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');
try {
  require('@babel/core').transform(code, { presets: ['@babel/preset-react', '@babel/preset-typescript']});
  console.log("No syntax error");
} catch(e) {
  console.error(e.message);
}
