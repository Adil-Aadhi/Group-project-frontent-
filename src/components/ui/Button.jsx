function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-[var(--primary)] text-[var(--bg)] hover:opacity-90",

    secondary:
      "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)]",

    outline:
      "bg-transparent text-[var(--primary)] border border-[var(--primary)]",
  };

  return (
    <button
      type={type}
      className={`
        px-4 py-2
        rounded-xl
        font-medium
        transition-all
        cursor-pointer
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
