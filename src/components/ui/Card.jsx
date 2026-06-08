function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-[var(--surface)]
        border border-[var(--border)]
        rounded-2xl
        p-6
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;