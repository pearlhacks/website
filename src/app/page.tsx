import { EnvelopeIntro } from "@/components/Scroll/EnvelopeIntro";
import { MailRoute } from "@/components/Scroll/MailRoute";
import { StatsPlayground } from "@/components/Scroll/StatsPlayground";
import { About } from "@/components/Sections/About";
import { FAQPreview } from "@/components/Sections/FAQPreview";
import { Footer } from "@/components/Sections/Footer";
import { Nav } from "@/components/Sections/Nav";
import { Sponsors } from "@/components/Sections/Sponsors";
import {
  getAbout,
  getFAQ,
  getFooter,
  getJourney,
  getSettings,
  getSponsors,
  getStats,
} from "@/lib/content";

export default async function Home() {
  const [settings, about, journey, stats, sponsors, faq, footer] =
    await Promise.all([
      getSettings(),
      getAbout(),
      getJourney(),
      getStats(),
      getSponsors(),
      getFAQ(),
      getFooter(),
    ]);

  // One visible focus ring for every link and button on the page. Dark
  // sections switch --focus-ring to a light color so it shows on navy.
  return (
    <div className="relative w-full bg-postal-sky text-postal-navy [--focus-ring:theme(colors.postal.navy.DEFAULT)] [&_:focus-visible]:outline [&_:focus-visible]:outline-[3px] [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[color:var(--focus-ring)]">
      <Nav settings={settings} />
      <EnvelopeIntro settings={settings} />
      <About about={about} />
      <MailRoute journey={journey} />
      <StatsPlayground stats={stats} />
      <Sponsors sponsors={sponsors} />
      <FAQPreview faq={faq} />
      <Footer footer={footer} name={settings.name} />
    </div>
  );
}
