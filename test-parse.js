const parseDetailedAbsences = (text) => {
  if (!text || !text.trim()) return { vl: 0, sl: 0, fl: 0, pl: 0, spl: 0, vl_wop: 0, sl_wop: 0, unknown: 0 };
  
  const parseChunk = (chunk) => {
    let days = 0;
    const dayMap = new Map();
    const parts = chunk.split(',');
    for (let part of parts) {
      part = part.trim();
      if (!part) continue;
      const isHalf = part.toLowerCase().includes('half') || part.toLowerCase().includes('am') || part.toLowerCase().includes('pm');
      const weight = isHalf ? 0.5 : 1;
      const rangeMatch = part.match(/(\d+)\s*-\s*(\d+)/);
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
      const numMatch = part.match(/(\d+)/);
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
  
  if (!/(VL WOP|SL WOP|AWOL|LWOP|WOP|VL|SL|FL|PL|SPL)\s*:/.test(upperText)) {
      result.unknown = parseChunk(text);
      return result;
  }

  const parts = upperText.split(/(VL WOP|SL WOP|AWOL|LWOP|WOP|VL|SL|FL|PL|SPL)\s*:/).filter(Boolean);
  
  let currentType = 'unknown';
  for (let i = 0; i < parts.length; i++) {
     const p = parts[i].trim();
     if (['VL WOP', 'SL WOP', 'AWOL', 'LWOP', 'WOP', 'VL', 'SL', 'FL', 'PL', 'SPL'].includes(p)) {
         currentType = p.toLowerCase().replace(' ', '_');
         if (currentType === 'awol' || currentType === 'lwop' || currentType === 'wop') currentType = 'vl_wop';
     } else {
         result[currentType] += parseChunk(p);
     }
  }
  return result;
};

console.log(parseDetailedAbsences("SL: 1, 2, 3 VL: 4, 5, 6"));
console.log(parseDetailedAbsences("AWOL: 1-5"));
console.log(parseDetailedAbsences("SL WOP: 1, 2"));
console.log(parseDetailedAbsences("LWOP: 3"));
