import React, { useState, useRef, useEffect } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>}
    <input 
      className={`border-2 border-gray-200 p-3 text-sm focus:border-accent focus:outline-none rounded-none transition-colors ${className}`} 
      {...props} 
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>}
    <textarea 
      className={`border-2 border-gray-200 p-3 text-sm focus:border-accent focus:outline-none rounded-none transition-colors min-h-[120px] resize-y ${className}`} 
      {...props} 
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>}
    <div className="relative">
      <select 
        className={`appearance-none w-full border-2 border-gray-200 bg-white p-3 text-sm focus:border-accent focus:outline-none rounded-none transition-colors ${className}`} 
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

interface MultiSelectProps {
  label?: string;
  options: { label: string; value: string }[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (optionValue: string) => {
    if (!optionValue) return; 
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div className="flex flex-col gap-1 w-full" ref={containerRef}>
      {label && <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>}
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`border-2 border-gray-200 bg-white p-3 text-sm cursor-pointer flex justify-between items-center ${isOpen ? 'border-accent' : ''} transition-colors min-h-[46px]`}
        >
          <span className={`block truncate ${value.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
            {value.length === 0 ? placeholder : `${value.length} selected`}
          </span>
          <svg className={`fill-current h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
        
        {isOpen && (
          <div className="absolute z-20 w-full bg-white border-2 border-t-0 border-gray-200 max-h-60 overflow-y-auto shadow-xl">
            {options.filter(opt => opt.value !== '').map((opt) => (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={`p-3 text-sm cursor-pointer hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0 ${value.includes(opt.value) ? 'bg-accent/5' : ''}`}
              >
                <div className={`w-4 h-4 border border-gray-300 flex items-center justify-center transition-colors ${value.includes(opt.value) ? 'bg-accent border-accent' : 'bg-white'}`}>
                   {value.includes(opt.value) && (
                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="4" d="M5 13l4 4L19 7" />
                     </svg>
                   )}
                </div>
                <span className="font-medium">{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface CollapsibleProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  count?: number;
}

export const Collapsible: React.FC<CollapsibleProps> = ({ title, isOpen, onToggle, children, count }) => (
  <div className="border-2 border-gray-100 border-t-0 first:border-t-2">
    <button 
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 text-sm font-bold uppercase tracking-wider bg-white hover:bg-gray-50 transition-colors ${isOpen ? 'bg-gray-50' : ''}`}
    >
      <div className="flex items-center gap-2">
        <span>{title}</span>
        {count && count > 0 ? (
          <span className="bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-none">{count}</span>
        ) : null}
      </div>
      <svg 
        className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    {isOpen && (
      <div className="p-4 border-t-2 border-gray-100 bg-white animate-in slide-in-from-top-1">
        {children}
      </div>
    )}
  </div>
);
