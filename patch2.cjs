const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardViewer.tsx', 'utf8');

const target = `          <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">Est. Daily Rate: ₱{dailyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>`;

const replace = `          <p className="text-[9px] uppercase font-bold text-slate-400 mt-1">Est. Daily Rate: ₱{dailyRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        </div>
      </div>`;

if (code.includes(target)) {
  code = code.replace(target, replace);
  fs.writeFileSync('src/components/LeaveCardViewer.tsx', code);
  console.log("Patched fixed!");
} else {
  console.log("Not found.");
}
