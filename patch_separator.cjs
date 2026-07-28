const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetDesktop = `                ) : (
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 border-r border-gray-200 font-bold whitespace-nowrap">{rec.period}</td>`;

const replaceDesktop = `                ) : rec.isSeparator ? (
                  <tr className="border-b-4 border-gray-300 bg-gray-100">
                    <td colSpan={11} className="p-0 relative group">
                      {deletingId === rec.id ? (
                        <div className="flex items-center justify-center gap-4 py-3 bg-red-50">
                          <span className="text-red-600 text-sm font-bold">Delete Separator?</span>
                          <button type="button" onClick={() => handleDelete(rec.id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs">Confirm</button>
                          <button type="button" onClick={() => setDeletingId(null)} className="px-3 py-1 bg-gray-200 text-gray-800 rounded text-xs">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-3">
                          <span className="font-bold text-gray-500 uppercase tracking-widest">{rec.period || '--- YEAR SEPARATOR ---'}</span>
                          <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button type="button" onClick={() => handleEdit(rec)} className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Edit Separator">
                              <Edit2 size={14} />
                            </button>
                            <button type="button" onClick={() => setDeletingId(rec.id)} className="p-1 text-red-600 hover:bg-red-100 rounded" title="Delete Separator">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 border-r border-gray-200 font-bold whitespace-nowrap">{rec.period}</td>`;

code = code.replace(targetDesktop, replaceDesktop);

const targetMobile = `            {editingId === rec.id ? (
              <div>
                <div className="flex justify-between items-center mb-3">`;

const replaceMobile = `            {editingId === rec.id ? (
              <div>
                <div className="flex justify-between items-center mb-3">`;
// Wait, I should also change mobile view but it might be easier to do it with edit_file or similar.

const targetMobileRender = `            ) : (
              <div>
                <div className="flex justify-between items-start mb-3 border-b border-dashed border-slate-300 pb-3">`;

const replaceMobileRender = `            ) : rec.isSeparator ? (
              <div className="py-2 flex justify-between items-center bg-gray-100 rounded-lg px-4 border-2 border-gray-300 border-dashed">
                <span className="font-bold text-gray-500 uppercase tracking-widest text-sm">{rec.period || '--- SEPARATOR ---'}</span>
                {deletingId === rec.id ? (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleDelete(rec.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">Delete</button>
                    <button type="button" onClick={() => setDeletingId(null)} className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs">Cancel</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleEdit(rec)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded" title="Edit"><Edit2 size={14} /></button>
                    <button type="button" onClick={() => setDeletingId(rec.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded" title="Delete"><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-3 border-b border-dashed border-slate-300 pb-3">`;

code = code.replace(targetMobileRender, replaceMobileRender);

fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
