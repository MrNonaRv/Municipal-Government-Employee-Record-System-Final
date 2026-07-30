const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

// Remove all lazy/Suspense from react imports
code = code.replace(/import \{ lazy, Suspense \} from 'react';\n?/g, '');
code = code.replace(/import React, \{ useState, useEffect, Suspense, lazy \} from 'react';/g, "import React, { useState, useEffect } from 'react';");
code = code.replace(/import React, \{ useState, useEffect \} from 'react';/, "import React, { useState, useEffect, Suspense, lazy } from 'react';");

// Move all const ... = lazy(...) below the imports
const lazyDeclarations = [];
code = code.replace(/^const \w+ = lazy\(.*\);$/gm, match => {
  lazyDeclarations.push(match);
  return '';
});

// Find the last import
let lastImportIndex = 0;
const importRegex = /^import .* from '.*';$/gm;
let match;
while ((match = importRegex.exec(code)) !== null) {
  lastImportIndex = match.index + match[0].length;
}

if (lastImportIndex > 0) {
  code = code.slice(0, lastImportIndex) + '\n\n' + lazyDeclarations.join('\n') + code.slice(lastImportIndex);
}

fs.writeFileSync('src/components/ProfileModal.tsx', code);
