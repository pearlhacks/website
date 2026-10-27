import Image from "next/image";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { SecondaryButton } from "@/components/Buttons/SecondaryButton";
import { Settings } from "@/lib/content";

interface NavProps {
  settings: Settings;
}

export function Nav({ settings }: NavProps) {
  const { name, nav, apply, mlhBadge } = settings;

  const links = nav.map((link) => (
    <li key={link.href}>
      <Link
        href={link.href}
        className="block py-2 font-sans font-bold hover:text-postal-blue transition ease-in-out"
      >
        {link.label}
      </Link>
    </li>
  ));

  return (
    <>
      {/* First tab stop: lets keyboard users jump past the nav. */}
      <a
        href="#content"
        className="sr-only font-sans font-bold focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[70] focus:rounded-full focus:bg-postal-paper focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-50 w-full bg-postal-navy text-postal-paper shadow-sm [--focus-ring:theme(colors.postal.paper)]">
        {/* Right padding leaves room for the MLH badge hanging over the bar. */}
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 pr-24 md:pr-32">
          <Link href="/" className="flex items-center gap-2 font-sans font-bold text-lg">
            <Image src="/images/PH2026Logo.svg" alt="" width={40} height={40} />
            <span>{name}</span>
          </Link>

          <nav aria-label="Main" className="hidden md:flex items-center gap-6">
            <ul className="flex gap-5">{links}</ul>
            {apply.href && (
              <SecondaryButton href={apply.href} textColor="text-postal-navy">
                {apply.label}
              </SecondaryButton>
            )}
          </nav>

          {/* Native disclosure: the phone menu works without JavaScript. */}
          <details className="group md:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-full p-2 [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Menu</span>
              <Bars3Icon className="h-6 w-6 group-open:hidden" />
              <XMarkIcon className="hidden h-6 w-6 group-open:block" />
            </summary>
            <nav aria-label="Main" className="absolute inset-x-0 top-full bg-postal-navy px-4 pb-6 shadow-md">
              <ul>{links}</ul>
              {apply.href && (
                <div className="mt-4">
                  <SecondaryButton href={apply.href} textColor="text-postal-navy">
                    {apply.label}
                  </SecondaryButton>
                </div>
              )}
            </nav>
          </details>
        </div>
      </header>

      {/* MLH requires the trust badge at the top right of member events' homepages.
          Fixed, so it stays in that corner while the page scrolls. */}
      <a
        href={mlhBadge.href}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed right-4 top-0 z-[60] block w-[60px] md:right-6 md:w-[84px]"
      >
        <Image
          src={mlhBadge.image}
          alt={mlhBadge.alt}
          width={100}
          height={175}
          unoptimized
          className="h-auto w-full"
        />
      </a>
    </>
  );
}
