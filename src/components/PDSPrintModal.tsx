import React from 'react';
import { X, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { Employee } from '../types/employee';

interface Props {
  employee: Employee;
  onClose: () => void;
}

export default function PDSPrintModal({ employee, onClose }: Props) {
  
  const printPDS = () => {
    window.print();
  };

  // Helper to get child at index
  const getChild = (index: number) => {
    if (employee.children && index < employee.children.length) {
      return employee.children[index];
    }
    return { name: '', dob: '' };
  };

  // Education helpers
  const getEduc = (level: string) => {
    return employee.education?.find(e => e.level.toLowerCase() === level.toLowerCase()) || {
      school: '', course: '', from: '', to: '', honors: '', yearGraduated: ''
    };
  };

  const elem = getEduc('Elementary');
  const sec = getEduc('Secondary');
  const voc = getEduc('Vocational/Trade Course');
  const coll = getEduc('College');
  const grad = getEduc('Graduate Studies');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm print:static print:p-0 print:block print:bg-white"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-slate-200 rounded-2xl shadow-2xl w-[98vw] max-w-[1200px] h-[95vh] flex flex-col overflow-hidden print:w-full print:max-w-none print:shadow-none print:block print:overflow-visible print:h-auto print:rounded-none print:bg-white relative"
      >
        {/* Controls - Hidden in print */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center no-print shrink-0">
          <div>
            <h2 className="font-bold text-lg">Personal Data Sheet (CS Form 212)</h2>
            <p className="text-xs text-slate-300">Official Civil Service Form Layout</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={printPDS}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm"
            >
              <Printer size={16} /> Print PDS
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Print Area */}
        <div className="flex-1 overflow-y-auto p-8 print:p-0 flex justify-center items-start">
          
          <div className="bg-white w-[8.5in] min-w-[8.5in] p-[0.3in] text-black font-sans shrink-0 print:w-full print:min-w-0 print:p-[0.2in] mx-auto shadow-sm print:shadow-none">
            
            {/* Header */}
            <div className="text-[10px] italic font-bold mb-1">CS Form No. 212</div>
            <div className="text-[10px] italic font-bold mb-4">Revised 2017</div>
            
            <h1 className="text-center font-black text-3xl mb-4 uppercase" style={{ fontFamily: 'Arial Black, Impact, sans-serif' }}>PERSONAL DATA SHEET</h1>
            
            <div className="text-[9px] font-bold italic mb-1">WARNING: Any misrepresentation made in the Personal Data Sheet and the Work Experience Sheet shall cause the filing of administrative/criminal case/s against the person concerned.</div>
            <div className="text-[9px] font-bold italic mb-3">READ THE ATTACHED GUIDE TO FILLING OUT THE PERSONAL DATA SHEET (PDS) BEFORE ACCOMPLISHING THE PDS FORM.</div>
            
            <div className="flex justify-between items-end mb-1">
              <div className="text-[9px]">Print legibly. Tick appropriate boxes ( <input type="checkbox" checked readOnly className="inline-block scale-75" /> ) and use separate sheet if necessary. Indicate N/A if not applicable.  <b>DO NOT ABBREVIATE.</b></div>
              <div className="text-[10px] flex items-center gap-1 border border-black p-1 bg-gray-200">
                <span className="font-bold">1. CS ID No.</span>
                <span className="bg-white px-8 py-1 border border-black text-[9px]">(Do not fill up. For CSC use only)</span>
              </div>
            </div>

            {/* MAIN TABLE */}
            <div className="border-[2px] border-black text-[10px]">
              
              {/* SECTION I */}
              <div className="bg-gray-400 text-white font-bold italic p-1 border-b-[2px] border-black text-xs">
                I. PERSONAL INFORMATION
              </div>

              {/* Row 2: Name */}
              <div className="flex border-b border-black">
                <div className="w-[18%] bg-gray-200 border-r border-black p-1">2. SURNAME</div>
                <div className="w-[82%] p-1 uppercase font-bold">{employee.surname || 'N/A'}</div>
              </div>
              <div className="flex border-b border-black">
                <div className="w-[18%] bg-gray-200 border-r border-black p-1 pl-4">FIRST NAME</div>
                <div className="w-[50%] p-1 uppercase font-bold border-r border-black">{employee.firstName || 'N/A'}</div>
                <div className="w-[32%] flex">
                   <div className="w-1/2 bg-gray-200 border-r border-black p-1 text-[8px] leading-tight flex items-center">NAME EXTENSION (JR., SR)</div>
                   <div className="w-1/2 p-1 uppercase font-bold">{employee.nameExtension || 'N/A'}</div>
                </div>
              </div>
              <div className="flex border-b border-black">
                <div className="w-[18%] bg-gray-200 border-r border-black p-1 pl-4">MIDDLE NAME</div>
                <div className="w-[82%] p-1 uppercase font-bold">{employee.middleName || 'N/A'}</div>
              </div>

              {/* Row 3-15 */}
              <div className="flex border-b border-black">
                {/* Left Col */}
                <div className="w-[45%] flex flex-col border-r border-black">
                  
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">3. DATE OF BIRTH<br/><span className="text-[8px]">(mm/dd/yyyy)</span></div>
                    <div className="w-[60%] p-1 uppercase">{employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) : 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">4. PLACE OF BIRTH</div>
                    <div className="w-[60%] p-1 uppercase">N/A</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">5. SEX</div>
                    <div className="w-[60%] p-1 flex items-center gap-4 uppercase">
                      <label className="flex items-center gap-1"><input type="checkbox" checked={employee.sex === 'Male'} readOnly /> Male</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={employee.sex === 'Female'} readOnly /> Female</label>
                    </div>
                  </div>
                  <div className="flex border-b border-black min-h-[40px]">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">6. CIVIL STATUS</div>
                    <div className="w-[60%] p-1 grid grid-cols-2 gap-1 text-[9px] uppercase">
                      <label className="flex items-center gap-1"><input type="checkbox" checked={employee.civilStatus === 'Single'} readOnly /> Single</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={employee.civilStatus === 'Married'} readOnly /> Married</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={employee.civilStatus === 'Widowed'} readOnly /> Widowed</label>
                      <label className="flex items-center gap-1"><input type="checkbox" checked={employee.civilStatus === 'Separated'} readOnly /> Separated</label>
                      <label className="flex items-center gap-1 col-span-2"><input type="checkbox" checked={!['Single','Married','Widowed','Separated'].includes(employee.civilStatus) && !!employee.civilStatus} readOnly /> Other/s:</label>
                    </div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">7. HEIGHT (m)</div>
                    <div className="w-[60%] p-1 uppercase">{employee.height || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">8. WEIGHT (kg)</div>
                    <div className="w-[60%] p-1 uppercase">{employee.weight || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">9. BLOOD TYPE</div>
                    <div className="w-[60%] p-1 uppercase">{employee.bloodType || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">10. GSIS ID NO.</div>
                    <div className="w-[60%] p-1 uppercase">{employee.gsisNo || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">11. PAG-IBIG ID NO.</div>
                    <div className="w-[60%] p-1 uppercase">{employee.pagibigNo || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">12. PHILHEALTH NO.</div>
                    <div className="w-[60%] p-1 uppercase">{employee.philhealthNo || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">13. SSS NO.</div>
                    <div className="w-[60%] p-1 uppercase">{employee.sssNo || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">14. TIN NO.</div>
                    <div className="w-[60%] p-1 uppercase">{employee.tin || 'N/A'}</div>
                  </div>
                  <div className="flex flex-1">
                    <div className="w-[40%] bg-gray-200 border-r border-black p-1">15. AGENCY EMPLOYEE NO.</div>
                    <div className="w-[60%] p-1 uppercase">{employee.agencyEmployeeNo || 'N/A'}</div>
                  </div>

                </div>

                {/* Right Col */}
                <div className="w-[55%] flex flex-col">
                  
                  <div className="flex border-b border-black min-h-[50px]">
                    <div className="w-[30%] bg-gray-200 border-r border-black p-1">16. CITIZENSHIP<br/><span className="text-[8px] text-center block mt-2 text-gray-500">If holder of  dual citizenship, <br/> please indicate the details.</span></div>
                    <div className="w-[70%] p-1">
                      <div className="flex gap-4 mb-1">
                        <label className="flex items-center gap-1"><input type="checkbox" checked={employee.citizenship?.toLowerCase().includes('filipino')} readOnly /> Filipino</label>
                        <label className="flex items-center gap-1"><input type="checkbox" checked={!employee.citizenship?.toLowerCase().includes('filipino') && !!employee.citizenship} readOnly /> Dual Citizenship</label>
                      </div>
                      <div className="flex gap-4 ml-6 text-[9px]">
                        <label className="flex items-center gap-1"><input type="checkbox" readOnly /> by birth</label>
                        <label className="flex items-center gap-1"><input type="checkbox" readOnly /> by naturalization</label>
                      </div>
                      <div className="text-center mt-1 border-b border-black mx-4 uppercase h-4 text-[9px]">{!employee.citizenship?.toLowerCase().includes('filipino') ? employee.citizenship : ''}</div>
                      <div className="text-center text-[7px]">Pls. indicate country</div>
                    </div>
                  </div>

                  <div className="flex border-b border-black">
                    <div className="w-[30%] bg-gray-200 border-r border-black p-1 flex items-center justify-center text-center">17. RESIDENTIAL ADDRESS</div>
                    <div className="w-[70%] flex flex-col">
                      <div className="flex border-b border-black h-8">
                        <div className="w-1/2 border-r border-black flex items-end justify-center pb-1 text-[9px] uppercase px-1">{employee.residentialAddress || 'N/A'}</div>
                        <div className="w-1/2 flex items-end justify-center pb-1 text-[9px] uppercase px-1"></div>
                      </div>
                      <div className="flex border-b border-black h-4 bg-gray-100 text-[8px] text-center italic">
                        <div className="w-1/2 border-r border-black">House/Block/Lot No.</div>
                        <div className="w-1/2">Street</div>
                      </div>
                      <div className="flex border-b border-black h-8">
                        <div className="w-1/2 border-r border-black flex items-end justify-center pb-1 text-[9px] uppercase px-1"></div>
                        <div className="w-1/2 flex items-end justify-center pb-1 text-[9px] uppercase px-1"></div>
                      </div>
                      <div className="flex border-b border-black h-4 bg-gray-100 text-[8px] text-center italic">
                        <div className="w-1/2 border-r border-black">Subdivision/Village</div>
                        <div className="w-1/2">Barangay</div>
                      </div>
                      <div className="flex border-b border-black h-8">
                        <div className="w-1/2 border-r border-black flex items-end justify-center pb-1 text-[9px] uppercase px-1">Mambusao</div>
                        <div className="w-1/2 flex items-end justify-center pb-1 text-[9px] uppercase px-1">Capiz</div>
                      </div>
                      <div className="flex h-4 bg-gray-100 text-[8px] text-center italic">
                        <div className="w-1/2 border-r border-black">City/Municipality</div>
                        <div className="w-1/2">Province</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[30%] bg-gray-200 border-r border-black p-1 flex items-center justify-center text-center">18. ZIP CODE</div>
                    <div className="w-[70%] p-1 flex items-center justify-center uppercase">{employee.zipCode || 'N/A'}</div>
                  </div>

                  <div className="flex border-b border-black">
                    <div className="w-[30%] bg-gray-200 border-r border-black p-1 flex items-center justify-center text-center">19. PERMANENT ADDRESS</div>
                    <div className="w-[70%] flex flex-col">
                      <div className="flex border-b border-black h-8">
                        <div className="w-1/2 border-r border-black flex items-end justify-center pb-1 text-[9px] uppercase px-1">{employee.permanentAddress || 'N/A'}</div>
                        <div className="w-1/2 flex items-end justify-center pb-1 text-[9px] uppercase px-1"></div>
                      </div>
                      <div className="flex border-b border-black h-4 bg-gray-100 text-[8px] text-center italic">
                        <div className="w-1/2 border-r border-black">House/Block/Lot No.</div>
                        <div className="w-1/2">Street</div>
                      </div>
                      <div className="flex border-b border-black h-8">
                        <div className="w-1/2 border-r border-black flex items-end justify-center pb-1 text-[9px] uppercase px-1"></div>
                        <div className="w-1/2 flex items-end justify-center pb-1 text-[9px] uppercase px-1"></div>
                      </div>
                      <div className="flex border-b border-black h-4 bg-gray-100 text-[8px] text-center italic">
                        <div className="w-1/2 border-r border-black">Subdivision/Village</div>
                        <div className="w-1/2">Barangay</div>
                      </div>
                      <div className="flex border-b border-black h-8">
                        <div className="w-1/2 border-r border-black flex items-end justify-center pb-1 text-[9px] uppercase px-1">Mambusao</div>
                        <div className="w-1/2 flex items-end justify-center pb-1 text-[9px] uppercase px-1">Capiz</div>
                      </div>
                      <div className="flex h-4 bg-gray-100 text-[8px] text-center italic">
                        <div className="w-1/2 border-r border-black">City/Municipality</div>
                        <div className="w-1/2">Province</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex border-b border-black flex-1">
                    <div className="w-[30%] bg-gray-200 border-r border-black p-1 flex items-center justify-center text-center">20. ZIP CODE</div>
                    <div className="w-[70%] p-1 flex items-center justify-center uppercase">{employee.zipCode || 'N/A'}</div>
                  </div>
                  
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[30%] bg-gray-200 border-r border-black p-1">21. TELEPHONE NO.</div>
                    <div className="w-[70%] p-1 uppercase">{employee.telephone || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black flex-1">
                    <div className="w-[30%] bg-gray-200 border-r border-black p-1">22. MOBILE NO.</div>
                    <div className="w-[70%] p-1 uppercase">{employee.cellphone || 'N/A'}</div>
                  </div>
                  <div className="flex flex-1">
                    <div className="w-[30%] bg-gray-200 border-r border-black p-1">23. E-MAIL ADDRESS (if any)</div>
                    <div className="w-[70%] p-1 uppercase">{employee.email || 'N/A'}</div>
                  </div>

                </div>
              </div>


              {/* SECTION II */}
              <div className="bg-gray-400 text-white font-bold italic p-1 border-y-[2px] border-black text-xs">
                II. FAMILY BACKGROUND
              </div>
              
              <div className="flex border-b border-black">
                {/* Spouse / Parents */}
                <div className="w-[55%] flex flex-col border-r border-black">
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1">24. SPOUSE'S SURNAME</div>
                    <div className="w-[65%] p-1 uppercase font-bold">{employee.spouseSurname || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1 pl-4">FIRST NAME</div>
                    <div className="w-[65%] flex">
                      <div className="w-[65%] p-1 uppercase font-bold border-r border-black">{employee.spouseFirstName || 'N/A'}</div>
                      <div className="w-[35%] flex flex-col">
                        <div className="bg-gray-200 text-[6px] p-0.5 border-b border-black leading-none text-center">NAME EXTENSION (JR., SR)</div>
                        <div className="p-1 uppercase text-center font-bold">N/A</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1 pl-4">MIDDLE NAME</div>
                    <div className="w-[65%] p-1 uppercase font-bold">{employee.spouseMiddleName || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1">OCCUPATION</div>
                    <div className="w-[65%] p-1 uppercase">{employee.spouseOccupation || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1">EMPLOYER/BUSINESS NAME</div>
                    <div className="w-[65%] p-1 uppercase">{employee.spouseEmployer || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1">BUSINESS ADDRESS</div>
                    <div className="w-[65%] p-1 uppercase">N/A</div>
                  </div>
                  <div className="flex border-b border-black h-6">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1">TELEPHONE NO.</div>
                    <div className="w-[65%] p-1 uppercase">{employee.spouseTelephone || 'N/A'}</div>
                  </div>
                  
                  {/* Father */}
                  <div className="flex border-b border-black mt-0">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1">26. FATHER'S SURNAME</div>
                    <div className="w-[65%] p-1 uppercase font-bold">{employee.fatherSurname || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1 pl-4">FIRST NAME</div>
                    <div className="w-[65%] flex">
                      <div className="w-[65%] p-1 uppercase font-bold border-r border-black">{employee.fatherFirstName || 'N/A'}</div>
                      <div className="w-[35%] flex flex-col">
                        <div className="bg-gray-200 text-[6px] p-0.5 border-b border-black leading-none text-center">NAME EXTENSION (JR., SR)</div>
                        <div className="p-1 uppercase text-center font-bold">N/A</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1 pl-4">MIDDLE NAME</div>
                    <div className="w-[65%] p-1 uppercase font-bold">{employee.fatherMiddleName || 'N/A'}</div>
                  </div>

                  {/* Mother */}
                  <div className="flex border-b border-black mt-0">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1">27. MOTHER'S MAIDEN NAME</div>
                    <div className="w-[65%] p-1 bg-gray-200"></div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1 pl-4">SURNAME</div>
                    <div className="w-[65%] p-1 uppercase font-bold">{employee.motherSurname || 'N/A'}</div>
                  </div>
                  <div className="flex border-b border-black">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1 pl-4">FIRST NAME</div>
                    <div className="w-[65%] p-1 uppercase font-bold">{employee.motherFirstName || 'N/A'}</div>
                  </div>
                  <div className="flex h-6">
                    <div className="w-[35%] bg-gray-200 border-r border-black p-1 pl-4">MIDDLE NAME</div>
                    <div className="w-[65%] p-1 uppercase font-bold">{employee.motherMiddleName || 'N/A'}</div>
                  </div>
                </div>

                {/* Children */}
                <div className="w-[45%] flex flex-col">
                  <div className="flex border-b border-black bg-gray-200 h-6">
                    <div className="w-[65%] border-r border-black p-1">25. NAME of CHILDREN  (Write full name and list all)</div>
                    <div className="w-[35%] p-1 text-center">DATE OF BIRTH (mm/dd/yyyy)</div>
                  </div>
                  
                  {Array.from({length: 12}).map((_, i) => (
                    <div key={i} className={`flex ${i < 11 ? 'border-b' : ''} border-black h-[22px]`}>
                      <div className="w-[65%] border-r border-black p-1 text-[9px] uppercase px-2">{getChild(i).name}</div>
                      <div className="w-[35%] p-1 text-[9px] text-center">{getChild(i).dob ? new Date(getChild(i).dob).toLocaleDateString('en-US', {month: '2-digit', day: '2-digit', year: 'numeric'}) : ''}</div>
                    </div>
                  ))}
                  
                  <div className="flex h-4 bg-gray-200 border-t border-black justify-center items-center text-[7px] italic text-red-600 font-bold">
                    (Continue on separate sheet if necessary)
                  </div>
                </div>
              </div>


              {/* SECTION III */}
              <div className="bg-gray-400 text-white font-bold italic p-1 border-y-[2px] border-black text-xs">
                III. EDUCATIONAL BACKGROUND
              </div>

              {/* Educ Headers */}
              <div className="flex border-b border-black bg-gray-200 text-center items-center">
                <div className="w-[14%] border-r border-black p-1">28.<br/>LEVEL</div>
                <div className="w-[22%] border-r border-black p-1">NAME OF SCHOOL<br/>(Write in full)</div>
                <div className="w-[22%] border-r border-black p-1">BASIC EDUCATION/DEGREE/COURSE<br/>(Write in full)</div>
                <div className="w-[14%] border-r border-black flex flex-col h-full">
                  <div className="border-b border-black p-1 flex-1 flex items-center justify-center">PERIOD OF ATTENDANCE</div>
                  <div className="flex flex-1">
                    <div className="w-1/2 border-r border-black p-1">From</div>
                    <div className="w-1/2 p-1">To</div>
                  </div>
                </div>
                <div className="w-[10%] border-r border-black p-1 text-[8px]">HIGHEST LEVEL/UNITS EARNED<br/>(if not graduated)</div>
                <div className="w-[8%] border-r border-black p-1 text-[8px]">YEAR GRADUATED</div>
                <div className="w-[10%] p-1 text-[8px]">SCHOLARSHIP/ ACADEMIC HONORS RECEIVED</div>
              </div>

              {/* Educ Rows */}
              {[
                { label: 'ELEMENTARY', data: elem },
                { label: 'SECONDARY', data: sec },
                { label: 'VOCATIONAL / TRADE COURSE', data: voc },
                { label: 'COLLEGE', data: coll },
                { label: 'GRADUATE STUDIES', data: grad }
              ].map((row, i) => (
                <div key={i} className={`flex border-b border-black min-h-[30px] ${i === 4 ? 'border-b-0' : ''}`}>
                  <div className="w-[14%] bg-gray-200 border-r border-black p-1 flex items-center">{row.label}</div>
                  <div className="w-[22%] border-r border-black p-1 text-[9px] flex items-center justify-center text-center uppercase leading-tight">{row.data.school || 'N/A'}</div>
                  <div className="w-[22%] border-r border-black p-1 text-[9px] flex items-center justify-center text-center uppercase leading-tight">{row.data.course || 'N/A'}</div>
                  <div className="w-[14%] border-r border-black flex">
                    <div className="w-1/2 border-r border-black p-1 flex items-center justify-center text-[9px]">{row.data.from ? new Date(row.data.from).getFullYear() : 'N/A'}</div>
                    <div className="w-1/2 p-1 flex items-center justify-center text-[9px]">{row.data.to ? new Date(row.data.to).getFullYear() : 'N/A'}</div>
                  </div>
                  <div className="w-[10%] border-r border-black p-1 flex items-center justify-center text-[9px] text-center uppercase">N/A</div>
                  <div className="w-[8%] border-r border-black p-1 flex items-center justify-center text-[9px]">{row.data.yearGraduated || 'N/A'}</div>
                  <div className="w-[10%] p-1 flex items-center justify-center text-[9px] text-center uppercase leading-tight">{row.data.honors || 'N/A'}</div>
                </div>
              ))}
              
              <div className="flex h-4 bg-gray-200 border-t border-black justify-center items-center text-[7px] italic text-red-600 font-bold">
                (Continue on separate sheet if necessary)
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between mt-2 text-[9px] font-bold italic">
              <div>SIGNATURE: _________________________________________</div>
              <div>DATE: _______________________</div>
            </div>
            <div className="text-right text-[8px] italic mt-4">CS FORM 212 (Revised 2017), Page 1 of 4</div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
