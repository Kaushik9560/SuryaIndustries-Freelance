import React from "react";
export const Card = ({ children, className = "", hoverable = true, ...props }) => {
    return (<div className={`bg-white border border-brand-border rounded-custom-lg p-6 md:p-8 shadow-soft-sm transition-all duration-300 ${hoverable ? "hover:-translate-y-1 hover:shadow-soft-md" : ""} ${className}`} {...props}>
      {children}
    </div>);
};
