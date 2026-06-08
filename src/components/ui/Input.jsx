function Input({
  label,
  error,
  type = "text",
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium">
          {label}
        </label>
      )}

      <input
        type={type}
        className={`
          w-full
          px-4 py-3
          rounded-xl
          border
          border-[var(--border)]
          bg-[var(--surface)]
          text-[var(--text-primary)]
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--primary)]
          ${className}
        `}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
