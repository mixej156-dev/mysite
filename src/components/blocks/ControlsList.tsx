export type Control = { title: string; body: string };

/** Numbered rows for an ordered sequence: number, title, explanation. */
export function ControlsList({ items }: { items: Control[] }) {
  return (
    <ol className="border-b border-rule">
      {items.map((item, i) => (
        <li
          key={item.title}
          className="grid gap-3 border-t border-rule py-8 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8"
        >
          <span className="font-mono text-small text-muted">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="text-h3">{item.title}</h3>
          <p className="max-w-[56ch] font-serif text-body text-muted">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}
