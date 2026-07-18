import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hoverable = true,
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-brand-border rounded-custom-lg p-6 md:p-8 shadow-soft-sm transition-all duration-300 ${
        hoverable ? "hover:-translate-y-1 hover:shadow-soft-md" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
