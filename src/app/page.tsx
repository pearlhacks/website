import { EnvelopeIntro } from "@/components/Scroll/EnvelopeIntro";
import { MailRoute } from "@/components/Scroll/MailRoute";
import { StatsPlayground } from "@/components/Scroll/StatsPlayground";
import { About } from "@/components/Sections/About";
import { FAQ } from "@/components/Sections/FAQ";
import { Footer } from "@/components/Sections/Footer";
import { Nav } from "@/components/Sections/Nav";
import { SponsorBand } from "@/components/Sections/SponsorBand";
import { Team } from "@/components/Sections/Team";
import { Weekend } from "@/components/Sections/Weekend";
import {
  getAbout,
  getFAQ,
  getFooter,
  getPrograms,
  getSettings,
  getSponsors,
  getStats,
  getTeam,
  getWeekend,
} from "@/lib/content";

export default async function Home() {
  const [settings, about, programs, weekend, stats, sponsors, team, faq, footer] =
    await Promise.all([
      getSettings(),
      getAbout(),
      getPrograms(),
      getWeekend(),
      getStats(),
      getSponsors(),
      getTeam(),
      getFAQ(),
      getFooter(),
    ]);

  // The whole site is this one scroll; the nav jumps to sections by id. The
  // order follows the questions a visitor has: what and when (the letter),
  // is it for me, what would I do, what's the weekend like, is it worth it,
  // who's behind it, anything else. Sponsor bands run between sections
  // instead of a sponsors section of their own.
  //
  // One visible focus ring for every link and button on the page. Dark
  // sections switch --focus-ring to a light color so it shows on navy.
  return (
    <div className="relative w-full bg-postal-sky text-postal-navy [--focus-ring:theme(colors.postal.navy.DEFAULT)] [&_:focus-visible]:outline [&_:focus-visible]:outline-[3px] [&_:focus-visible]:outline-offset-2 [&_:focus-visible]:outline-[color:var(--focus-ring)]">
      <Nav settings={settings} />
      <EnvelopeIntro settings={settings} />
      <About about={about} />
      <SponsorBand sponsors={sponsors} />
      <MailRoute programs={programs} />
      <Weekend weekend={weekend} />
      <SponsorBand sponsors={sponsors} reverse repeat />
      <StatsPlayground stats={stats} />
      <Team team={team} />
      <SponsorBand sponsors={sponsors} repeat />
      <FAQ faq={faq} />
      <Footer footer={footer} name={settings.name} />
    </div>
  );
}
