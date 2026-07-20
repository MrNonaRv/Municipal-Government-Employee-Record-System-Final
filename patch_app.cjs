const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('useDeferredValue')) {
  code = code.replace(
    "import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';",
    "import React, { useEffect, useState, useMemo, lazy, Suspense, useDeferredValue } from 'react';"
  );
  
  // Find where searchQuery is defined
  const queryMatch = code.match(/const \[searchQuery, setSearchQuery\] = useState\(''\);/);
  if (queryMatch) {
    code = code.replace(
      /const \[searchQuery, setSearchQuery\] = useState\(''\);/,
      "const [searchQuery, setSearchQuery] = useState('');\n  const deferredSearchQuery = useDeferredValue(searchQuery);"
    );
  }
  
  // Find where it's used in filtering
  code = code.replace(
    /const q = searchQuery\.toLowerCase\(\);/,
    "const q = deferredSearchQuery.toLowerCase();"
  );
  
  code = code.replace(
    /}, \[employees, searchQuery, statusFilter, departmentFilter\]\);/,
    "}, [employees, deferredSearchQuery, statusFilter, departmentFilter]);"
  );
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched src/App.tsx");
} else {
  console.log("Already patched?");
}
