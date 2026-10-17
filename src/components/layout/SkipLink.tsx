export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-pill bg-accent px-4 py-2 text-small font-medium text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-tooltip"
    >
      Skip to content
    </a>
  );
}
