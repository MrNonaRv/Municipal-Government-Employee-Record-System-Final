const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetToReplace = `                  <tr className="bg-blue-50 border-b border-gray-200">
                    <td colSpan={11} className="p-4">
                      {renderEditFormFields()}
                      {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
                      <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
                        <button 
                          type="button" 
                          onClick={() => setEditingId(null)} 
                          className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded text-xs hover:bg-gray-50 transition-colors"
                        >
                          <X size={14} /> Cancel
                        </button>
                        <button 
                          type="button" 
                          onClick={handleSave} 
                          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--green)] text-white rounded text-xs hover:bg-opacity-90 transition-colors"
                        >
                          <Check size={14} /> Save
                        </button>
                      </div>
                    </td>
                  </tr>`;

const replacement = `                  <tr className="bg-blue-50 border-b border-gray-200">
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.period || ''} onChange={e => setEditForm({...editForm, period: e.target.value})} className="w-full text-xs p-1 border rounded bg-white" placeholder="Period" />
                      {error && !editForm.period?.trim() && <div className="text-red-500 text-[9px] mt-0.5 leading-tight">{error}</div>}
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlEarned || ''} onChange={e => setEditForm({...editForm, vlEarned: e.target.value})} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlAbsUndWp || ''} onChange={e => setEditForm({...editForm, vlAbsUndWp: e.target.value})} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlBalance || ''} onChange={e => setEditForm({...editForm, vlBalance: e.target.value})} className="w-full text-xs p-1 text-center font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlAbsUndWop || ''} onChange={e => setEditForm({...editForm, vlAbsUndWop: e.target.value})} className="w-full text-xs p-1 text-center text-red-500 font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slEarned || ''} onChange={e => setEditForm({...editForm, slEarned: e.target.value})} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slAbsUndWp || ''} onChange={e => setEditForm({...editForm, slAbsUndWp: e.target.value})} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slBalance || ''} onChange={e => setEditForm({...editForm, slBalance: e.target.value})} className="w-full text-xs p-1 text-center font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slAbsUndWop || ''} onChange={e => setEditForm({...editForm, slAbsUndWop: e.target.value})} className="w-full text-xs p-1 text-center text-red-500 font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.dateAndAction || ''} onChange={e => setEditForm({...editForm, dateAndAction: e.target.value})} className="w-full text-xs p-1 border rounded bg-white" placeholder="Action" />
                    </td>
                    <td className="px-1 py-1 text-center align-top">
                      <div className="flex gap-1 justify-center">
                        <button type="button" onClick={handleSave} className="p-1.5 bg-[var(--green)] text-white hover:bg-opacity-90 rounded" title="Save"><Check size={12} /></button>
                        <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded" title="Cancel"><X size={12} /></button>
                      </div>
                    </td>
                  </tr>`;

code = code.replace(targetToReplace, replacement);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
