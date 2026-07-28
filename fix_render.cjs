const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const target = `    </div>
  );

  return (
    <div className="flex flex-col gap-4">`;

const replace = `    </div>
  );
  };

  return (
    <div className="flex flex-col gap-4">`;

code = code.replace(target, replace);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
