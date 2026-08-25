export const genId = () =>
  "EMP-" +
  Date.now().toString(36).toUpperCase() +
  "-" +
  Math.random().toString(36).substring(2, 9).toUpperCase();

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      if (file.type.startsWith("image/")) {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          const MAX_DIM = 600;
          if (w > MAX_DIM || h > MAX_DIM) {
            if (w > h) {
              h = Math.round(h * (MAX_DIM / w));
              w = MAX_DIM;
            } else {
              w = Math.round(w * (MAX_DIM / h));
              h = MAX_DIM;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.4));
          } else {
            resolve(result);
          }
        };
        img.onerror = () => resolve(result);
        img.src = result;
      } else {
        resolve(result);
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

export const generateEmptyEmployee =
  (): import("../types/employee").Employee => ({
    id: genId(),
    photo: null,
    surname: "",
    firstName: "",
    middleName: "",
    nameExtension: "",
    dateOfBirth: "",
    sex: "",
    civilStatus: "",
    citizenship: "",
    height: "",
    weight: "",
    bloodType: "",
    residentialAddress: "",
    permanentAddress: "",
    zipCode: "",
    telephone: "",
    cellphone: "",
    email: "",
    gsisNo: "",
    pagibigNo: "",
    philhealthNo: "",
    sssNo: "",
    tin: "",
    agencyEmployeeNo: "",
    spouseSurname: "",
    spouseFirstName: "",
    spouseMiddleName: "",
    spouseOccupation: "",
    spouseEmployer: "",
    spouseTelephone: "",
    children: [],
    fatherSurname: "",
    fatherFirstName: "",
    fatherMiddleName: "",
    motherSurname: "",
    motherFirstName: "",
    motherMiddleName: "",
    education: [],
    serviceRecords: [],
    pdsScan: null,
    leaveRecords: [],
  });

export const resolveServiceRecordField = (
  records: import("../types/employee").ServiceRecord[],
  index: number,
  field: keyof import("../types/employee").ServiceRecord,
): string => {
  for (let i = index; i >= 0; i--) {
    const val = records[i][field] as string;
    if (val && val.trim().toLowerCase() !== "-do-") {
      return val;
    }
  }
  return "";
};

export const getResolvedLatestRecord = (
  records: import("../types/employee").ServiceRecord[],
): import("../types/employee").ServiceRecord | null => {
  if (!records || records.length === 0) return null;
  const lastIndex = records.length - 1;
  const resolvedRecord = { ...records[lastIndex] };

  resolvedRecord.designation = resolveServiceRecordField(
    records,
    lastIndex,
    "designation",
  );
  resolvedRecord.status = resolveServiceRecordField(
    records,
    lastIndex,
    "status",
  );
  resolvedRecord.salary = resolveServiceRecordField(
    records,
    lastIndex,
    "salary",
  );
  resolvedRecord.station = resolveServiceRecordField(
    records,
    lastIndex,
    "station",
  );
  resolvedRecord.branch = resolveServiceRecordField(
    records,
    lastIndex,
    "branch",
  );

  return resolvedRecord;
};

export const dataURLtoBlob = (dataurl: string): Blob => {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const bstr = atob(arr[1]);
  const u8arr = Uint8Array.from(bstr, c => c.charCodeAt(0));
  return new Blob([u8arr], { type: mime });
};

export const formatSalary = (salary: string, status: string): string => {
  if (!salary) return "";
  
  // Extract number and possible existing suffix (e.g., /day, /a)
  // This helps if the input already contains the suffix
  const hasDay = salary.toLowerCase().includes("/day");
  const hasAnnual = salary.toLowerCase().includes("/a");
  
  let cleanSalary = salary.replace(/[^0-9.]/g, "");
  if (!cleanSalary) return salary;

  // Format with thousand separator
  const parts = cleanSalary.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formattedSalary = parts.join(".");

  const statusLower = status.toLowerCase();
  
  // Explicitly check for status keywords to determine suffix
  if (statusLower.includes("contractual") || statusLower.includes("temp.")) {
    return `${formattedSalary}/day`;
  } else if (statusLower.includes("perm.") || statusLower.includes("prob.")) {
    return `${formattedSalary}/a`;
  }
  
  // If no status match, but salary originally had a suffix, preserve it
  if (hasDay) return `${formattedSalary}/day`;
  if (hasAnnual) return `${formattedSalary}/a`;

  return formattedSalary;
};

export const sortServiceRecords = (records: import("../types/employee").ServiceRecord[]) => {
  return [...records].sort((a, b) => {
    const dateA = new Date(a.from).getTime();
    const dateB = new Date(b.from).getTime();
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    return dateA - dateB;
  });
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
};

export const formatDateInput = (value: string): string => {
  if (value.toLowerCase() === 'present') return 'PRESENT';
  const digits = value.replace(/\D/g, "");
  
  if (digits.length === 0) return '';
  
  let formatted = digits.slice(0, 2);
  if (digits.length > 2) {
    formatted += '/' + digits.slice(2, 4);
  }
  if (digits.length > 4) {
    formatted += '/' + digits.slice(4, 6);
  }
  
  return formatted;
};
