import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label && (
          <label htmlFor={inputId} className="text-[10px] font-semibold text-brand-secondary uppercase tracking-widest">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full bg-white border border-brand-border rounded-custom-md px-4 py-3 text-sm text-foreground placeholder:text-neutral-400 outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200 ${
            error ? "border-red-500 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <span id={`${inputId}-error`} className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
