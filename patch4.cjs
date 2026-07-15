const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            <div className="relative w-full sm:w-64 md:w-80 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label="Search employees"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all text-sm h-10"
                />
              </div>
              <button
                onClick={() => {
                  addToast('Refreshing records from server...', 'info');
                  loadEmployees(true);
                }}
                disabled={isLoading}
                title="Refresh records from server"
                className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:bg-[var(--gold-light)] hover:text-[var(--gold-dark)] transition-all shrink-0 active:scale-90"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>`;

const replacement = `            <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-[var(--gold)] text-sm h-10 max-w-[150px] truncate"
              >
                <option value="">All Stations</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-[var(--gold)] text-sm h-10 max-w-[150px] truncate"
              >
                <option value="">All Statuses</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="relative flex-1 w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  aria-label="Search employees"
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-[var(--gold)] focus:border-transparent transition-all text-sm h-10"
                />
              </div>
              <button
                onClick={() => {
                  addToast('Refreshing records from server...', 'info');
                  loadEmployees(true);
                }}
                disabled={isLoading}
                title="Refresh records from server"
                className="p-2.5 rounded-full bg-slate-100 text-slate-500 hover:bg-[var(--gold-light)] hover:text-[var(--gold-dark)] transition-all shrink-0 active:scale-90"
              >
                <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
