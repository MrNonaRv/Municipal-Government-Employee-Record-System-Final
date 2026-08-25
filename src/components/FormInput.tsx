import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormInput({ label, error, className = '', ...props }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={props.id || props.name} className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-sans">
        {label}
      </label>
      <input
        {...props}
        className={`w-full border rounded-lg px-3 py-1.5 text-xs uppercase focus:ring-1 focus:ring-[var(--gold)] focus:border-transparent transition-all ${
          error ? 'border-red-500 bg-red-50/10 font-bold' : 'border-slate-200 bg-white'
        } ${className}`}
      />
      {error && <p className="text-[9px] text-red-500 font-bold uppercase tracking-tight">{error}</p>}
    </div>
  );
}
