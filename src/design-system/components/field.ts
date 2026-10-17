/* Shared field styles: Input, Select and other form controls use the same frame. */
export const fieldFrame =
  "flex h-11 w-full items-center gap-2 rounded-field border border-rule bg-surface px-3.5 text-body text-text transition-colors duration-fast " +
  "hover:border-rule-strong focus-within:border-accent-text focus-within:ring-3 focus-within:ring-accent-text/25";

export const fieldFrameInvalid = "border-danger hover:border-danger focus-within:border-danger focus-within:ring-danger/25";

export const fieldFrameDisabled = "pointer-events-none opacity-50";

export const fieldLabel = "text-small font-medium text-text";

export const fieldHint = "text-small text-muted";

export const fieldError = "text-small text-danger";
