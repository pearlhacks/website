import { PlusIcon } from "@heroicons/react/16/solid";
import { FadeIn } from "@/components/Scroll/FadeIn";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { FAQSection } from "@/lib/content";
import { FAQ as FAQItem } from "@/utils/Types";
import { formatContent } from "@/utils/helpers";

interface FAQProps {
  faq: FAQSection;
}

// Questions grouped by category, in the order each category first appears.
function byCategory(items: FAQItem[]) {
  const groups = new Map<string, FAQItem[]>();
  for (const item of items) {
    groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  }
  return Array.from(groups, ([category, questions]) => ({ category, questions }));
}

// Every question, collapsed. Native <details>: opens and closes with zero
// JavaScript.
export function FAQ({ faq }: FAQProps) {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="w-full scroll-mt-16 bg-postal-sky text-postal-navy">
      <div className="mx-auto max-w-3xl px-4 py-20">
        <SectionHeading id="faq-heading" title={faq.title} />
        <FadeIn className="mt-8 space-y-10">
          {byCategory(faq.items).map(({ category, questions }) => (
            <div key={category}>
              <h3 className="font-sans text-xl font-bold">{category}</h3>
              <div className="mt-4 space-y-3">
                {questions.map((item) => (
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
              </div>
            </div>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
