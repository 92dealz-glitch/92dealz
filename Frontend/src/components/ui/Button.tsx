import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
};

export function Button({ variant = "primary", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center rounded px-4 py-2 text-sm font-medium cursor-pointer";
  const style =
    variant === "primary"
      ? "bg-black text-white hover:opacity-90"
      : "bg-transparent border";
  return (
    <button className={`${base} ${style}`} {...props}>
      {children}
    </button>
  );
}

export default Button;
