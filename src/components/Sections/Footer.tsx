import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/16/solid";
import { FooterInfo } from "@/lib/content";
import { formatContent } from "@/utils/helpers";

interface FooterProps {
  footer: FooterInfo;
  name: string;
}

const SOCIAL_ICONS: Record<string, JSX.Element> = {
  linkedin: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
    </svg>
  ),
  github: (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  email: <EnvelopeIcon className="h-6 w-6" />,
};

export function Footer({ footer, name }: FooterProps) {
  return (
    <footer className="w-full bg-postal-navy text-postal-sky [--focus-ring:theme(colors.postal.sky.DEFAULT)]">
      <Image src="/art/spot/footer.webp" alt="" width={1600} height={800} className="h-auto w-full" />
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {footer.columns.map((column) => (
            <div key={column.title} className="space-y-2">
              <h2 className="font-sans font-bold uppercase text-white break-words">{column.title}</h2>
              {/* Links share the text colour, so the underline is what marks them. */}
              <div className="break-words [&_a]:underline [&_a]:underline-offset-2">
                {formatContent(column.body)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-postal-sky/30 pt-6 md:flex-row">
          <p className="flex items-center gap-1">
            Made with <HeartIcon className="h-4 w-4" />
            <span className="sr-only">love</span> by {name}
          </p>
          <ul className="flex items-center gap-4">
            {footer.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  aria-label={social.label}
                  className="block rounded-full p-1 hover:text-postal-blue transition ease-in-out"
                >
                  {SOCIAL_ICONS[social.icon] ?? social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
