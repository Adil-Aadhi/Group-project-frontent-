function Logo({ compact = false }) {
  return (
    <a
      href="/"
      className="group inline-flex items-center gap-3 rounded-2xl text-[var(--text-primary)] outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      aria-label="VoxIntel AI home"
    >
      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_18px_45px_var(--border)]">
        <span className="absolute inset-1 rounded-xl bg-[color-mix(in_srgb,var(--primary)_16%,var(--surface))]" />
        <span className="relative h-5 w-5 rounded-lg bg-[var(--primary)] shadow-[0_0_28px_var(--primary)]" />
      </span>

      {!compact && (
       <span className="flex items-center gap-1 leading-none">
          <span className="text-lg font-bold tracking-normal">
            VoxIntel
          </span>

          <span className="text-sm font-semibold text-[var(--primary)]">
            AI
          </span>
        </span>
      )}
    </a>
  );
}

export default Logo;
