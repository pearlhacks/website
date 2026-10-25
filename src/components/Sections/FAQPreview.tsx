import { PlusIcon } from "@heroicons/react/16/solid";
import { SecondaryButton } from "@/components/Buttons/SecondaryButton";
import { FadeIn } from "@/components/Scroll/FadeIn";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { FAQPreview as FAQPreviewContent } from "@/lib/content";
import { formatContent } from "@/utils/helpers";

interface FAQPreviewProps {
  faq: FAQPreviewContent;
}

const PREVIEW_COUNT = 5;

// Native <details>: opens and closes with zero JavaScript.
export function FAQPreview({ faq }: FAQPreviewProps) {
  return (
    <section aria-labelledby="faq-heading" className="w-full bg-postal-sky text-postal-navy">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <SectionHeading id="faq-heading" title={faq.title} />
        <FadeIn className="mt-8 space-y-3">
          {faq.items.slice(0, PREVIEW_COUNT).map((item) => (
            <details key={item.question} className="group rounded-2xl bg-postal-paper shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <PlusIcon className="h-5 w-5 shrink-0 transition-transform group-open:rotate-45" />
              </summary>
              {/* Links share the text colour, so the underline is what marks them. */}
              <div className="px-5 pb-5 [&_a]:underline [&_a]:underline-offset-2">
                {formatContent(item.answer)}
              </div>
            </details>
          ))}
        </FadeIn>
        <div className="mt-8">
          <SecondaryButton href={faq.link.href} textColor="text-postal-navy">
            {faq.link.label}
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}
