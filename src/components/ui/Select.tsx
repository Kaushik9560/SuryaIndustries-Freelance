import React, { useId } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label && (
          <label htmlFor={selectId} className="text-[10px] font-semibold text-brand-secondary uppercase tracking-widest">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${selectId}-error` : undefined}
            className={`w-full bg-white border border-brand-border rounded-custom-md px-4 py-3 pr-10 text-sm text-foreground appearance-none outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200 ${
              error ? "border-red-500 focus:border-red-500" : ""
            } ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-brand-secondary">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && <span id={`${selectId}-error`} className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
