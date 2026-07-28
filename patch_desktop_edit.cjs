const fs = require('fs');
let code = fs.readFileSync('src/components/LeaveCardEditor.tsx', 'utf8');

const targetDesktopEdit = `                {editingId === rec.id ? (
                  <tr className="bg-blue-50 border-b border-gray-200">
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.period || ''} onChange={e => handleFieldChange('period', e.target.value)} className="w-full text-xs p-1 border rounded bg-white" placeholder="Period" />
                      {error && !editForm.period?.trim() && <div className="text-red-500 text-[9px] mt-0.5 leading-tight">{error}</div>}
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlEarned || ''} onChange={e => handleFieldChange('vlEarned', e.target.value)} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlAbsUndWp || ''} onChange={e => handleFieldChange('vlAbsUndWp', e.target.value)} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlBalance || ''} onChange={e => handleFieldChange('vlBalance', e.target.value)} className="w-full text-xs p-1 text-center font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlAbsUndWop || ''} onChange={e => handleFieldChange('vlAbsUndWop', e.target.value)} className="w-full text-xs p-1 text-center text-red-500 font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slEarned || ''} onChange={e => handleFieldChange('slEarned', e.target.value)} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slAbsUndWp || ''} onChange={e => handleFieldChange('slAbsUndWp', e.target.value)} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slBalance || ''} onChange={e => handleFieldChange('slBalance', e.target.value)} className="w-full text-xs p-1 text-center font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slAbsUndWop || ''} onChange={e => handleFieldChange('slAbsUndWop', e.target.value)} className="w-full text-xs p-1 text-center text-red-500 font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.dateAndAction || ''} onChange={e => handleFieldChange('dateAndAction', e.target.value)} className="w-full text-xs p-1 border rounded bg-white" placeholder="Action" />
                    </td>
                    <td className="px-1 py-1 text-center align-top">
                      <div className="flex gap-1 justify-center">
                        <button type="button" onClick={handleSave} className="p-1.5 bg-[var(--green)] text-white hover:bg-opacity-90 rounded" title="Save"><Check size={12} /></button>
                        <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded" title="Cancel"><X size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ) : rec.isSeparator ? (`;

const replaceDesktopEdit = `                {editingId === rec.id ? (
                  editForm.isSeparator ? (
                    <tr className="bg-gray-50 border-b-4 border-gray-300">
                      <td colSpan={10} className="px-3 py-2 border-r border-gray-200 align-middle">
                        <input type="text" value={editForm.period || ''} onChange={e => handleFieldChange('period', e.target.value)} className="w-full text-sm font-bold text-gray-600 uppercase tracking-widest p-2 border rounded bg-white text-center" placeholder="YEAR SEPARATOR TEXT" />
                        {error && !editForm.period?.trim() && <div className="text-red-500 text-[9px] mt-0.5 leading-tight text-center">{error}</div>}
                      </td>
                      <td className="px-1 py-2 text-center align-middle">
                        <div className="flex gap-1 justify-center">
                          <button type="button" onClick={handleSave} className="p-1.5 bg-[var(--green)] text-white hover:bg-opacity-90 rounded" title="Save"><Check size={12} /></button>
                          <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded" title="Cancel"><X size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                  <tr className="bg-blue-50 border-b border-gray-200">
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.period || ''} onChange={e => handleFieldChange('period', e.target.value)} className="w-full text-xs p-1 border rounded bg-white" placeholder="Period" />
                      {error && !editForm.period?.trim() && <div className="text-red-500 text-[9px] mt-0.5 leading-tight">{error}</div>}
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlEarned || ''} onChange={e => handleFieldChange('vlEarned', e.target.value)} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlAbsUndWp || ''} onChange={e => handleFieldChange('vlAbsUndWp', e.target.value)} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlBalance || ''} onChange={e => handleFieldChange('vlBalance', e.target.value)} className="w-full text-xs p-1 text-center font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.vlAbsUndWop || ''} onChange={e => handleFieldChange('vlAbsUndWop', e.target.value)} className="w-full text-xs p-1 text-center text-red-500 font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slEarned || ''} onChange={e => handleFieldChange('slEarned', e.target.value)} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slAbsUndWp || ''} onChange={e => handleFieldChange('slAbsUndWp', e.target.value)} className="w-full text-xs p-1 text-center border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slBalance || ''} onChange={e => handleFieldChange('slBalance', e.target.value)} className="w-full text-xs p-1 text-center font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.slAbsUndWop || ''} onChange={e => handleFieldChange('slAbsUndWop', e.target.value)} className="w-full text-xs p-1 text-center text-red-500 font-bold border rounded bg-white" />
                    </td>
                    <td className="px-1 py-1 border-r border-gray-200 align-top">
                      <input type="text" value={editForm.dateAndAction || ''} onChange={e => handleFieldChange('dateAndAction', e.target.value)} className="w-full text-xs p-1 border rounded bg-white" placeholder="Action" />
                    </td>
                    <td className="px-1 py-1 text-center align-top">
                      <div className="flex gap-1 justify-center">
                        <button type="button" onClick={handleSave} className="p-1.5 bg-[var(--green)] text-white hover:bg-opacity-90 rounded" title="Save"><Check size={12} /></button>
                        <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded" title="Cancel"><X size={12} /></button>
                      </div>
                    </td>
                  </tr>
                  )
                ) : rec.isSeparator ? (`;

code = code.replace(targetDesktopEdit, replaceDesktopEdit);
fs.writeFileSync('src/components/LeaveCardEditor.tsx', code);
