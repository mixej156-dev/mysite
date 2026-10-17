/* Shared field styles: Input, Select and Textarea use the same frame.
   Border colours live in separate sets that are never applied together, because two border-colour
   utilities on one element resolve by stylesheet order, not class order. */
export const fieldFrame =
  "flex h-11 w-full items-center gap-2 rounded-field border bg-surface px-3.5 text-body text-text transition-colors duration-fast focus-within:ring-3";

export const fieldFrameValid =
  "border-rule hover:border-rule-strong focus-within:border-accent-text focus-within:ring-accent-text/25";

export const fieldFrameInvalid = "border-danger focus-within:ring-danger/25";

/** Frame colour for the current state */
export function fieldState(invalid: boolean) {
  return invalid ? fieldFrameInvalid : fieldFrameValid;
}

export const fieldFrameDisabled = "pointer-events-none opacity-50";

export const fieldLabel = "text-small font-medium text-text";

export const fieldHint = "text-small text-muted";

export const fieldError = "text-small text-danger";
