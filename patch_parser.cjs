const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const oldParserRegex = /const parseAbsentDays = \(text: string\) => \{[\s\S]*?return total;\n\};/;
const newParser = `const parseDetailedAbsences = (text: string) => {
  if (!text || !text.trim()) return { vl: 0, sl: 0, fl: 0, pl: 0, spl: 0, unknown: 0 };
  
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

  const result = { vl: 0, sl: 0, fl: 0, pl: 0, spl: 0, unknown: 0 };
  const upperText = text.toUpperCase();
  
  if (!/(VL|SL|FL|PL|SPL)\\s*:/.test(upperText)) {
      result.unknown = parseChunk(text);
      return result;
  }

  const parts = upperText.split(/(VL|SL|FL|PL|SPL)\\s*:/).filter(Boolean);
  
  let currentType = 'unknown';
  for (let i = 0; i < parts.length; i++) {
     const p = parts[i].trim();
     if (['VL', 'SL', 'FL', 'PL', 'SPL'].includes(p)) {
         currentType = p.toLowerCase();
     } else {
         (result as any)[currentType] += parseChunk(p);
     }
  }
  return result;
};`;

code = code.replace(oldParserRegex, newParser);

// Replace callers
// Caller 1
const caller1Regex = /let newVlAbsUndWp = field === 'vlAbsUndWp' \? value : '';\n\s*if \(field === 'particulars'\) \{\n\s*const days = parseAbsentDays\(value\);\n\s*if \(days > 0\) newVlAbsUndWp = days\.toString\(\);\n\s*\}/;
const newCaller1 = `let newVlAbsUndWp = field === 'vlAbsUndWp' ? value : '';
      let newSlAbsUndWp = field === 'slAbsUndWp' ? value : '';
      if (field === 'particulars') {
         const parsed = parseDetailedAbsences(value);
         if (parsed.vl > 0 || parsed.unknown > 0 || parsed.spl > 0 || parsed.pl > 0 || parsed.fl > 0) {
            newVlAbsUndWp = (parsed.vl + parsed.unknown + parsed.spl + parsed.pl + parsed.fl).toString();
         }
         if (parsed.sl > 0) {
            newSlAbsUndWp = parsed.sl.toString();
         }
      }`;
code = code.replace(caller1Regex, newCaller1);

code = code.replace("vlAbsUndWp: newVlAbsUndWp,", "vlAbsUndWp: newVlAbsUndWp,"); // Ensure no syntax errors
code = code.replace("slAbsUndWp: field === 'slAbsUndWp' ? value : '',", "slAbsUndWp: newSlAbsUndWp,"); // Replace slAbsUndWp initialisation with newSlAbsUndWp


// Caller 2
const caller2Regex = /const calculatedDays = parseAbsentDays\(finalValue\.toString\(\)\);[\s\S]*?updated\.slAbsUndWop = '';\n\s*\}/;
const newCaller2 = `const parsed = parseDetailedAbsences(finalValue.toString());
            const vWP = parseFloat(updated.vlAbsUndWp || '0') || 0;
            const sWP = parseFloat(updated.slAbsUndWp || '0') || 0;
            const vWOP = parseFloat(updated.vlAbsUndWop || '0') || 0;
            const sWOP = parseFloat(updated.slAbsUndWop || '0') || 0;
            
            const slDays = parsed.sl;
            const vlDays = parsed.vl + parsed.unknown + parsed.spl + parsed.pl + parsed.fl;

            if (slDays > 0) {
                if (sWOP > 0) updated.slAbsUndWop = slDays.toString();
                else updated.slAbsUndWp = slDays.toString();
            } else if (slDays === 0) {
                updated.slAbsUndWp = '';
                updated.slAbsUndWop = '';
            }

            if (vlDays > 0) {
                if (vWOP > 0) updated.vlAbsUndWop = vlDays.toString();
                else updated.vlAbsUndWp = vlDays.toString();
            } else if (vlDays === 0) {
                updated.vlAbsUndWp = '';
                updated.vlAbsUndWop = '';
            }`;
code = code.replace(caller2Regex, newCaller2);

fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
