export type Control = { title: string; body: string };

/** Numbered rows for an ordered sequence: number, title, explanation. */
export function ControlsList({ items }: { items: Control[] }) {
  return (
    <ol className="border-b border-rule">
      {items.map((item, i) => (
        <li
          key={item.title}
          className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-2 gap-y-2 border-t border-rule py-5 sm:grid-cols-1 sm:gap-3 sm:py-8 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8"
        >
          <span className="font-mono text-small leading-7 text-muted sm:leading-5">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="text-h4 sm:text-h3">{item.title}</h3>
          <p className="col-start-2 max-w-[56ch] font-serif text-body text-muted sm:col-start-auto">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}
