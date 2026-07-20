const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

code = code.replace(
  '<div className="text-center mb-10">',
  '<div className="text-center mb-6">'
);

code = code.replace(
  '<div className="flex justify-end mb-8">',
  '<div className="flex justify-end mb-6">'
);

code = code.replace(
  '<div className="mb-8 text-sm space-y-1">',
  '<div className="mb-6 text-sm space-y-1">'
);

code = code.replace(
  '<div className="mb-6 text-sm">',
  '<div className="mb-4 text-sm">'
);

code = code.replace(
  '<div className="px-8 space-y-6 text-sm mb-10">',
  '<div className="px-8 space-y-4 text-sm mb-8">'
);

code = code.replace(
  '<div className="mb-16 text-sm text-justify indent-8 leading-relaxed">',
  '<div className="mb-8 text-sm text-justify indent-8 leading-relaxed">'
);

code = code.replace(
  '<div className="flex justify-end mb-16 pr-12 text-sm">',
  '<div className="flex justify-end mb-8 pr-12 text-sm">'
);

code = code.replace(
  '<div className="mt-8 text-xs space-y-1">',
  '<div className="mt-4 text-xs space-y-1">'
);

fs.writeFileSync('src/components/NOSAModal.tsx', code);
