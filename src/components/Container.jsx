export default function Container({ className = "", children }) {
  return <div className={`section-inner ${className}`}>{children}</div>;
}

