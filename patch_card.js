const fs = require('fs');
let code = fs.readFileSync('src/components/EmployeeCard.tsx', 'utf8');

// List view fix
code = code.replace(
  /className=\`text-xs font-bold px-2 py-0\.5 rounded-full w-fit \$\{\n\s*true\n\s*\? "bg-emerald-50 text-emerald-600"\n\s*: "bg-amber-50 text-amber-600"\n\s*\}\`\n\s*>\n\s*\{latestSR\?\.designation \|\| "N\/A"\}/,
  `className=\`text-xs font-bold px-2 py-0.5 rounded-full w-fit \${
                latestSR?.status?.toLowerCase().includes('perm')
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }\`
            >
              {latestSR?.status || "N/A"}`
);

// Grid view fix
code = code.replace(
  /className=\`text-\[10px\] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md border \$\{\n\s*true\n\s*\? "bg-emerald-500\/20 text-emerald-400 border-emerald-500\/30"\n\s*: "bg-amber-500\/20 text-amber-400 border-amber-500\/30"\n\s*\}\`\n\s*>\n\s*\{latestSR\?\.designation \|\| "N\/A"\}/,
  `className=\`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md border \${
              latestSR?.status?.toLowerCase().includes('perm')
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            }\`
          >
            {latestSR?.status || "N/A"}`
);

fs.writeFileSync('src/components/EmployeeCard.tsx', code);
