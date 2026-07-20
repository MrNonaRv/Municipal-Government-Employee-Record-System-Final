const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add inputValue state
code = code.replace(
  "const [searchQuery, setSearchQuery] = useState('');",
  "const [inputValue, setInputValue] = useState('');\n  const [searchQuery, setSearchQuery] = useState('');\n  useEffect(() => {\n    const timer = setTimeout(() => setSearchQuery(inputValue), 300);\n    return () => clearTimeout(timer);\n  }, [inputValue]);"
);

// Update input value and onChange to use inputValue
code = code.replace(
  "value={searchQuery}\n                  onChange={e => setSearchQuery(e.target.value)}",
  "value={inputValue}\n                  onChange={e => setInputValue(e.target.value)}"
);

// We can still show the filtered count based on searchQuery
code = code.replace(
  "{searchQuery && (",
  "{inputValue && ("
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched src/App.tsx");
