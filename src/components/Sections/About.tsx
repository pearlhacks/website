import Image from "next/image";
import { SecondaryButton } from "@/components/Buttons/SecondaryButton";
import { FadeIn } from "@/components/Scroll/FadeIn";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { About as AboutContent } from "@/lib/content";

interface AboutProps {
  about: AboutContent;
}

export function About({ about }: AboutProps) {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="w-full scroll-mt-16 bg-postal-navy text-postal-sky [--focus-ring:theme(colors.postal.sky.DEFAULT)]"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
        <FadeIn className="space-y-5">
          <SectionHeading id="about-heading" title={about.title} light />
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
          <div className="rounded-2xl border-2 border-postal-sky/30 p-5">
            <h3 className="font-sans font-bold">{about.inclusivity.title}</h3>
            <p className="mt-2 leading-relaxed">{about.inclusivity.body}</p>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {about.links.map((link) => (
              <SecondaryButton
                key={link.href}
                href={link.href}
                textColor="text-postal-navy"
                hoverTextColor="hover:text-postal-sky"
              >
                {link.label}
              </SecondaryButton>
            ))}
          </div>
        </FadeIn>
        <FadeIn>
          <Image
            src="/art/spot/about.webp"
            alt=""
            width={1600}
            height={1200}
            className="h-auto w-full rounded-3xl"
          />
        </FadeIn>
      </div>
    </section>
  );
}
