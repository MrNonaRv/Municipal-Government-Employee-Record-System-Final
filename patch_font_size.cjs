const fs = require('fs');
let code = fs.readFileSync('src/components/NOSAModal.tsx', 'utf8');

// Replace all text-sm with text-[12pt] and text-xs with text-[10pt] or text-[11pt] where appropriate for the body text in the print area

code = code.replace(
  '<div className="mb-6 text-sm space-y-1">',
  '<div className="mb-6 text-[12pt] space-y-1">'
);

code = code.replace(
  '<div className="mb-4 text-sm">',
  '<div className="mb-4 text-[12pt]">'
);

code = code.replace(
  '<div className="mb-6 text-sm text-justify indent-8 leading-relaxed">',
  '<div className="mb-6 text-[12pt] text-justify indent-12 leading-relaxed">'
);

code = code.replace(
  '<div className="px-8 space-y-4 text-sm mb-8">',
  '<div className="px-8 space-y-6 text-[12pt] mb-8">'
);

code = code.replace(
  '<div className="mb-8 text-sm text-justify indent-8 leading-relaxed">',
  '<div className="mb-8 text-[12pt] text-justify indent-12 leading-relaxed">'
);

code = code.replace(
  '<div className="flex justify-end mb-8 pr-12 text-sm">',
  '<div className="flex justify-end mb-8 pr-12 text-[12pt]">'
);

code = code.replace(
  '<div className="text-xs space-y-1">',
  '<div className="text-[11pt] space-y-1">'
);

code = code.replace(
  '<div className="mt-4 text-xs space-y-1">',
  '<div className="mt-4 text-[11pt] space-y-1">'
);

code = code.replace(
  '<div className="flex justify-end mb-6">',
  '<div className="flex justify-end mb-6 text-[12pt]">'
);
code = code.replace(
  '<p className="text-sm">{new Date(dateOfNotice).toLocaleDateString(\'en-US\', { year: \'numeric\', month: \'long\', day: \'numeric\' })}</p>',
  '<p>{new Date(dateOfNotice).toLocaleDateString(\'en-US\', { year: \'numeric\', month: \'long\', day: \'numeric\' })}</p>'
);

fs.writeFileSync('src/components/NOSAModal.tsx', code);
