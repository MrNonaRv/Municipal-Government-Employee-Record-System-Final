const fs = require('fs');
let code = fs.readFileSync('src/components/EditModal.tsx', 'utf8');

const target = `  const handleSaveClick = async () => {
    const hasErrors = Object.values(validationErrors).some(err => err !== '');
    const requiredFields = ['surname', 'firstName'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof Employee]);
    
    if (hasErrors || missingFields.length > 0) {
      setError('Please fix all validation errors before saving.');
      return;
    }

    let finalFormData = formData;
    setError(null);
    onSave(finalFormData);
  };

  const validateField = (name: string, value: any) => {
    let errorMsg = '';
    const requiredFields = ['surname', 'firstName'];
    
    if (requiredFields.includes(name)) {
      if (!value || !value.trim()) errorMsg = 'This field is required';
    }

    return errorMsg;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
    setError(null);
  };`;

const replacement = `  const handleSaveClick = async () => {
    const newValidationErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key as keyof Employee]);
      if (err) newValidationErrors[key] = err;
    });

    if (Object.keys(newValidationErrors).length > 0) {
      setValidationErrors(newValidationErrors);
      setError('Please fix all validation errors before saving.');
      return;
    }

    let finalFormData = formData;
    setError(null);
    onSave(finalFormData);
  };

  const validateField = (name: string, value: any) => {
    let errorMsg = '';
    const requiredFields = ['surname', 'firstName', 'agencyEmployeeNo'];
    
    if (requiredFields.includes(name)) {
      if (!value || !value.trim()) errorMsg = 'This field is required';
    }

    if (name === 'email' && value && typeof value === 'string' && value.trim() !== '') {
      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMsg = 'Invalid email format';
      }
    }

    if (name === 'agencyEmployeeNo' && value && typeof value === 'string' && value.trim() !== '') {
      const duplicate = allEmployees.find(emp => emp.agencyEmployeeNo === value && emp.id !== formData.id);
      if (duplicate) {
        errorMsg = 'Employee ID already exists';
      }
    }

    return errorMsg;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    const errorMsg = validateField(name, value);
    setValidationErrors(prev => ({ ...prev, [name]: errorMsg }));
    setError(null);
  };`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/EditModal.tsx', code);
