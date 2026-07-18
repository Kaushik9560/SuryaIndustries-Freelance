import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 font-sans">
        {label && (
          <label className="text-[10px] font-semibold text-brand-secondary uppercase tracking-widest">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-white border border-brand-border rounded-custom-md px-4 py-3 text-sm text-foreground placeholder:text-neutral-400 outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200 resize-y min-h-[100px] ${
            error ? "border-red-500 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
