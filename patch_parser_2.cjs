const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const oldParserRegex = /const parseDetailedAbsences = \(text: string\) => \{[\s\S]*?return result;\n\};/;
const newParser = `const parseDetailedAbsences = (text: string) => {
  if (!text || !text.trim()) return { vl: 0, sl: 0, fl: 0, pl: 0, spl: 0, vl_wop: 0, sl_wop: 0, unknown: 0 };
  
  const parseChunk = (chunk: string) => {
    let days = 0;
    const dayMap = new Map<number, number>();
    const parts = chunk.split(',');
    for (let part of parts) {
      part = part.trim();
      if (!part) continue;
      const isHalf = part.toLowerCase().includes('half') || part.toLowerCase().includes('am') || part.toLowerCase().includes('pm');
      const weight = isHalf ? 0.5 : 1;
      const rangeMatch = part.match(/(\\d+)\\s*-\\s*(\\d+)/);
      if (rangeMatch) {
         const s = parseInt(rangeMatch[1]);
         const e = parseInt(rangeMatch[2]);
         if (e >= s && s <= 31 && e <= 31) {
            for (let i = s; i <= e; i++) {
               const curr = dayMap.get(i) || 0;
               dayMap.set(i, Math.max(curr, weight));
            }
         }
         continue;
      }
      const numMatch = part.match(/(\\d+)/);
      if (numMatch) {
         const val = parseInt(numMatch[1]);
         if (val <= 31) {
            const curr = dayMap.get(val) || 0;
            dayMap.set(val, Math.max(curr, weight));
         }
      }
    }
    for (const value of dayMap.values()) days += value;
    return days;
  };

  const result = { vl: 0, sl: 0, fl: 0, pl: 0, spl: 0, vl_wop: 0, sl_wop: 0, unknown: 0 };
  const upperText = text.toUpperCase();
  
  if (!/(VL WOP|SL WOP|AWOL|LWOP|WOP|VL|SL|FL|PL|SPL)\\s*:/.test(upperText)) {
      result.unknown = parseChunk(text);
      return result;
  }

  const parts = upperText.split(/(VL WOP|SL WOP|AWOL|LWOP|WOP|VL|SL|FL|PL|SPL)\\s*:/).filter(Boolean);
  
  let currentType = 'unknown';
  for (let i = 0; i < parts.length; i++) {
     const p = parts[i].trim();
     if (['VL WOP', 'SL WOP', 'AWOL', 'LWOP', 'WOP', 'VL', 'SL', 'FL', 'PL', 'SPL'].includes(p)) {
         currentType = p.toLowerCase().replace(' ', '_');
         if (currentType === 'awol' || currentType === 'lwop' || currentType === 'wop') currentType = 'vl_wop';
     } else {
         (result as any)[currentType] += parseChunk(p);
     }
  }
  return result;
};`;

code = code.replace(oldParserRegex, newParser);

// Replace callers

const caller1Regex = /let newVlAbsUndWp = field === 'vlAbsUndWp' \? value : '';[\s\S]*?if \(parsed\.sl > 0\) \{\n\s*newSlAbsUndWp = parsed\.sl\.toString\(\);\n\s*\}\n\s*\}/;
const newCaller1 = `let newVlAbsUndWp = field === 'vlAbsUndWp' ? value : '';
      let newSlAbsUndWp = field === 'slAbsUndWp' ? value : '';
      let newVlAbsUndWop = field === 'vlAbsUndWop' ? value : '';
      let newSlAbsUndWop = field === 'slAbsUndWop' ? value : '';
      
      if (field === 'particulars') {
         const parsed = parseDetailedAbsences(value);
         if (parsed.vl > 0 || parsed.unknown > 0 || parsed.spl > 0 || parsed.pl > 0 || parsed.fl > 0) {
            newVlAbsUndWp = (parsed.vl + parsed.unknown + parsed.spl + parsed.pl + parsed.fl).toString();
         }
         if (parsed.sl > 0) {
            newSlAbsUndWp = parsed.sl.toString();
         }
         if (parsed.vl_wop > 0) {
            newVlAbsUndWop = parsed.vl_wop.toString();
         }
         if (parsed.sl_wop > 0) {
            newSlAbsUndWop = parsed.sl_wop.toString();
         }
      }`;
code = code.replace(caller1Regex, newCaller1);


const caller2Regex = /const parsed = parseDetailedAbsences\(finalValue\.toString\(\)\);[\s\S]*?updated\.slAbsUndWop = '';\n\s*\}\n\s*\}\n/;
const newCaller2 = `const parsed = parseDetailedAbsences(finalValue.toString());
            
            const slDays = parsed.sl;
            const vlDays = parsed.vl + parsed.unknown + parsed.spl + parsed.pl + parsed.fl;
            const vlWopDays = parsed.vl_wop;
            const slWopDays = parsed.sl_wop;

            if (slDays > 0) {
                updated.slAbsUndWp = slDays.toString();
            } else if (slDays === 0) {
                updated.slAbsUndWp = '';
            }

            if (slWopDays > 0) {
                updated.slAbsUndWop = slWopDays.toString();
            } else if (slWopDays === 0) {
                updated.slAbsUndWop = '';
            }

            if (vlDays > 0) {
                updated.vlAbsUndWp = vlDays.toString();
            } else if (vlDays === 0) {
                updated.vlAbsUndWp = '';
            }

            if (vlWopDays > 0) {
                updated.vlAbsUndWop = vlWopDays.toString();
            } else if (vlWopDays === 0) {
                updated.vlAbsUndWop = '';
            }
          }
`;

code = code.replace(caller2Regex, newCaller2);
code = code.replace("placeholder = 'e.g. SL: 1,2,3 VL: 4,5,6';", "placeholder = 'e.g. VL: 1 SL: 2 AWOL: 3';");

// Make sure `newRec` uses newVlAbsUndWop etc
const newRecRegex = /vlAbsUndWop: field === 'vlAbsUndWop' \? value : '',\n\s*slEarned: field === 'slEarned' \? value : '1\.25',\n\s*slAbsUndWp: newSlAbsUndWp,\n\s*slBalance: field === 'slBalance' \? value : '',\n\s*slAbsUndWop: field === 'slAbsUndWop' \? value : '',/;
const newRecReplacement = `vlAbsUndWop: newVlAbsUndWop,
        slEarned: field === 'slEarned' ? value : '1.25',
        slAbsUndWp: newSlAbsUndWp,
        slBalance: field === 'slBalance' ? value : '',
        slAbsUndWop: newSlAbsUndWop,`;
code = code.replace(newRecRegex, newRecReplacement);

fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
