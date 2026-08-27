const fs = require('fs');
let code = fs.readFileSync('src/components/ProfileModal.tsx', 'utf8');

const brokenChunk = `<button
              onClick={() => setShowNosa(true)}
                          <button
              onClick={() => setShowPdsPrint(true)}
              aria-label="Generate PDS"
              className="flex items-center gap-2 p-2.5 md:px-5 md:py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-500/20 group"
            >
              <FileText
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline">PDS (CS Form 212)</span>
            </button>
            <button
              aria-label="Generate NOSA"`;

const fixedChunk = `<button
              onClick={() => setShowPdsPrint(true)}
              aria-label="Generate PDS"
              className="flex items-center gap-2 p-2.5 md:px-5 md:py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-purple-500/20 group"
            >
              <FileText
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline">PDS (CS Form 212)</span>
            </button>
            <button
              onClick={() => setShowNosa(true)}
              aria-label="Generate NOSA"`;

code = code.replace(brokenChunk, fixedChunk);
fs.writeFileSync('src/components/ProfileModal.tsx', code);
