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
