import { getImageProps } from "next/image";
import { MacWindow } from "../blocks/MacWindow";
import { PhoneMockup } from "../blocks/PhoneMockup";

const ALT = "The LONAR ECO. dashboard: total balance, balance chart, latest rewards and open positions";
const PHONE_ALT = "The LONAR ECO. dashboard on a phone: total balance, quick actions and the balance chart";
/* 1×1 transparent GIF: the <source> for screens where a shot is hidden, so it is never downloaded */
const NOTHING = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const DESKTOP_UP = "(min-width: 64rem)";
const BELOW_DESKTOP = "(max-width: 63.99rem)";

/**
 * The real dashboard. Desktop: the phone layout on an iPhone, turned in 3D. Below that: a macOS window with the
 * phone layout below `sm` and the desktop layout above. Each screen downloads only the shot it shows. The shots are
 * lossless WebP at 2x/3x served as they are: re-encoding blurs the small UI text.
 */
export function HeroScreenshot({ className }: { className?: string }) {
  const { props: windowShot } = getImageProps({
    alt: ALT,
    src: "/screens/dashboard-desktop.webp",
    width: 2560,
    height: 1600,
    /* No preload: it would fetch every shot on every screen */
    loading: "eager",
    fetchPriority: "high",
    unoptimized: true,
  });
  const { props: phoneShot } = getImageProps({
    alt: PHONE_ALT,
    src: "/screens/dashboard-phone.webp",
    width: 1320,
    height: 2580,
    loading: "eager",
    fetchPriority: "high",
    unoptimized: true,
  });

  return (
    <div className={className}>
      <MacWindow address="lonar.eco/dashboard" className="lg:hidden">
        <picture>
          <source media={DESKTOP_UP} srcSet={NOTHING} />
          <source media="(max-width: 39.99rem)" srcSet="/screens/dashboard-mobile.webp" width={1170} height={2280} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
          <img {...windowShot} className="block h-auto w-full" />
        </picture>
      </MacWindow>
      <PhoneMockup className="mx-auto [--pw:16.5rem] max-lg:hidden xl:[--pw:18.5rem]">
        <picture>
          <source media={BELOW_DESKTOP} srcSet={NOTHING} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps */}
          <img {...phoneShot} className="block h-full w-full object-cover object-top" />
        </picture>
      </PhoneMockup>
    </div>
  );
}
