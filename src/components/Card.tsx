import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white dark:bg-gray-800 shadow rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

export default Card;