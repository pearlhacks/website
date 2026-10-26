import Image from "next/image";
import { SecondaryButton } from "@/components/Buttons/SecondaryButton";
import { FadeIn } from "@/components/Scroll/FadeIn";
import { Hang } from "@/components/Scroll/Hang";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { About as AboutContent } from "@/lib/content";

interface AboutProps {
  about: AboutContent;
}

type Photo = AboutContent["photos"][number];

// Two strands of photos, split from the list in order: on wide screens one
// is centred in the space each side of the text (36rem wide, so each space is
// (100vw - 36rem) / 2), and on narrow ones both hang side by side above it.
// The strings differ in length so the strands don't line up.
const STRANDS = [
  {
    side: "lg:left-[calc((100vw-36rem)/4)] lg:-translate-x-1/2",
    strings: ["h-10 lg:h-28", "h-6 lg:h-14"],
    delay: 0,
  },
  {
    side: "lg:right-[calc((100vw-36rem)/4)] lg:translate-x-1/2",
    strings: ["h-16 lg:h-44", "h-6 lg:h-14"],
    delay: 0.2,
  },
];

export function About({ about }: AboutProps) {
  const half = Math.ceil(about.photos.length / 2);
  const strands = [about.photos.slice(0, half), about.photos.slice(half)];

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative w-full scroll-mt-16 overflow-clip bg-postal-navy text-postal-sky [--focus-ring:theme(colors.postal.sky.DEFAULT)]"
    >
      {/* The photos hang from the top edge like ornaments, framed as stamps. */}
      <div className="flex justify-center gap-6 px-4 lg:contents">
        {strands.map(
          (photos, index) =>
            photos.length > 0 && (
              <Hang
                key={index}
                delay={STRANDS[index].delay}
                className={`lg:absolute lg:top-0 ${STRANDS[index].side}`}
              >
                <ul className="flex flex-col items-center">
                  {photos.map((photo, position) => (
                    <li key={photo.src} className="flex flex-col items-center">
                      <span
                        aria-hidden="true"
                        className={`w-0.5 bg-postal-sky/60 ${STRANDS[index].strings[position] ?? "h-6"}`}
                      />
                      <Stamp photo={photo} />
                    </li>
                  ))}
                </ul>
              </Hang>
            )
        )}
      </div>

      <FadeIn className="mx-auto max-w-xl space-y-5 px-4 py-16 text-center lg:py-28">
        <SectionHeading id="about-heading" title={about.title} light />
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-lg leading-relaxed">
            {paragraph}
          </p>
        ))}
        {/* Highlighted in Dot's warm tan, so it stands out on the navy. */}
        <div className="rounded-2xl bg-postal-tan-light p-5 text-postal-navy shadow-lg">
          <h3 className="font-sans font-bold text-postal-red-dark">{about.inclusivity.title}</h3>
          <p className="mt-2 leading-relaxed">{about.inclusivity.body}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
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
    </section>
  );
}

// A photo framed as a postage stamp. The perforations are a dotted border in
// the section's navy, over the stamp's paper. On wide screens it fills 70% of
// the space beside the text, up to 20rem.
function Stamp({ photo }: { photo: Photo }) {
  return (
    <div className="relative w-36 border-[6px] border-dotted border-postal-navy bg-postal-paper p-1.5 shadow-lg lg:w-[min(20rem,calc((100vw-36rem)*0.35))]">
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 1024px) 320px, 144px"
          className="object-cover"
        />
      </div>
      <span
        aria-hidden="true"
        className="absolute bottom-2.5 right-2.5 rounded-sm bg-postal-paper/90 px-1 font-sans text-[10px] font-bold text-postal-navy"
      >
        PH27
      </span>
    </div>
  );
}
