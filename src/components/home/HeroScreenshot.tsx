import { getImageProps } from "next/image";
import { MacWindow } from "../blocks/MacWindow";

const ALT = "The LONAR ECO. dashboard: total balance, balance chart, latest rewards and open positions";

/**
 * The real dashboard in a macOS window: the phone layout below `sm`, the desktop layout above.
 * One <picture>, so each screen downloads only its own shot. On large screens the window runs off the
 * right edge (the section clips it), keeping the sidebar, balance and chart readable.
 */
export function HeroScreenshot({ className }: { className?: string }) {
  const common = { alt: ALT, priority: true, quality: 90 };
  const {
    props: { srcSet: desktop, ...rest },
  } = getImageProps({
    ...common,
    src: "/screens/dashboard-desktop.webp",
    width: 2880,
    height: 1800,
    sizes: "(min-width: 64rem) 60rem, 100vw",
  });
  const {
    props: { srcSet: mobile },
  } = getImageProps({ ...common, src: "/screens/dashboard-mobile.webp", width: 780, height: 1520, sizes: "20rem" });

  return (
    <MacWindow address="lonar.eco/dashboard" className={className}>
      <picture>
        <source media="(max-width: 39.99rem)" srcSet={mobile} width={780} height={1520} />
        <source media="(min-width: 40rem)" srcSet={desktop} width={2880} height={1800} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...rest} className="block h-auto w-full" />
      </picture>
    </MacWindow>
  );
}
