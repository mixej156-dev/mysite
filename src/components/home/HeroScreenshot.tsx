import { getImageProps } from "next/image";
import { MacWindow } from "../blocks/MacWindow";

const ALT = "The LONAR ECO. dashboard: total balance, balance chart, latest rewards and open positions";

/**
 * The real dashboard in a macOS window: the phone layout below `sm`, the desktop layout above.
 * One <picture>, so each screen downloads only its own shot. The shots are lossless WebP at 2x/3x and
 * served as they are: re-encoding blurs the small UI text.
 */
export function HeroScreenshot({ className }: { className?: string }) {
  const { props } = getImageProps({
    alt: ALT,
    src: "/screens/dashboard-desktop.webp",
    width: 2560,
    height: 1600,
    /* No preload: it would fetch the desktop shot on phones too */
    loading: "eager",
    fetchPriority: "high",
    unoptimized: true,
  });

  return (
    <MacWindow address="lonar.eco/dashboard" className={className}>
      <picture>
        <source media="(max-width: 39.99rem)" srcSet="/screens/dashboard-mobile.webp" width={1170} height={2280} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
        <img {...props} className="block h-auto w-full" />
      </picture>
    </MacWindow>
  );
}
