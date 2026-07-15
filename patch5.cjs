const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetState = `  const [isLoading, setIsLoading] = useState(true);`;
const replacementState = `  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;`;
code = code.replace(targetState, replacementState);

const targetEffect = `  useEffect(() => {
    loadEmployees();
    
    // Check sync status immediately`;
const replacementEffect = `  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, departmentFilter]);

  useEffect(() => {
    loadEmployees();
    
    // Check sync status immediately`;
code = code.replace(targetEffect, replacementEffect);

const targetRender = `        ) : (
          <motion.div 
            layout
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "flex flex-col gap-4 max-w-5xl mx-auto"
            }
          >
            <AnimatePresence>
              {filteredEmployees.map((emp) => (
                <motion.div 
                  key={emp.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <EmployeeCard 
                    employee={emp} 
                    onView={setViewingEmp} 
                    onEdit={(emp) => { setEditingEmp(emp); setEditTab('service'); }} 
                    onDelete={setDeletingEmp}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>`;

const replacementRender = `        ) : (
          <>
            <motion.div 
              layout
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "flex flex-col gap-4 max-w-5xl mx-auto"
              }
            >
              <AnimatePresence>
                {filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((emp) => (
                  <motion.div 
                    key={emp.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <EmployeeCard 
                      employee={emp} 
                      onView={setViewingEmp} 
                      onEdit={(emp) => { setEditingEmp(emp); setEditTab('service'); }} 
                      onDelete={setDeletingEmp}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {filteredEmployees.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-8 pb-8">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 disabled:opacity-50 font-medium text-sm hover:bg-slate-50 transition-colors text-slate-700"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-500 font-medium">
                  Page {currentPage} of {Math.ceil(filteredEmployees.length / itemsPerPage)}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredEmployees.length / itemsPerPage), p + 1))}
                  disabled={currentPage >= Math.ceil(filteredEmployees.length / itemsPerPage)}
                  className="px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200 disabled:opacity-50 font-medium text-sm hover:bg-slate-50 transition-colors text-slate-700"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>`;

code = code.replace(targetRender, replacementRender);

fs.writeFileSync('src/App.tsx', code);
