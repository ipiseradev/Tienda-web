import { forwardRef } from "react";

const Button = forwardRef(function Button(
  { as: As = "button", variant = "primary", className = "", children, ...props },
  ref
) {
  const variants = {
    primary: "btn-primary",
    accent: "btn-accent",
    ghost: "btn-ghost",
    dark: "btn-dark"
  };
  const base = variants[variant] || variants.primary;
  return (
    <As ref={ref} className={`${base} focus-ring ${className}`} {...props}>
      {children}
    </As>
  );
});

export default Button;
