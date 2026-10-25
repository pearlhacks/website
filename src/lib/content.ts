import site from "@/content/site.json";
import { Director, FAQ, Sponsor } from "@/utils/Types";
import { getTiers } from "@/utils/helpers";

// The only module that loads homepage content. Every getter is async so the
// source can move from site.json to an API or database without touching the
// components that call them.

export interface LinkItem {
  label: string;
  href: string;
}

export interface Settings {
  name: string;
  tagline: string;
  eventDates: string;
  /** ISO 8601 start time for the countdown, e.g. "2027-02-20T09:00:00-05:00". null hides it. */
  eventStart: string | null;
  location: string;
  /** An empty href hides every Apply button. */
  apply: LinkItem;
  nav: LinkItem[];
  mlhBadge: { href: string; image: string; alt: string };
}

export interface About {
  title: string;
  paragraphs: string[];
  inclusivity: { title: string; body: string };
  links: LinkItem[];
}

export interface Program {
  /** "Track" or "Focus Pathway". */
  label: string;
  title: string;
  body: string;
  points: string[];
}

export interface Programs {
  title: string;
  intro: string;
  items: Program[];
}

export interface Weekend {
  title: string;
  intro: string;
  /** The shape of the weekend, in order. Times live on the event portal. */
  steps: { title: string; body: string }[];
}

export interface Stats {
  title: string;
  items: { value: string; label: string }[];
  /** Alt text for public/art/stats/photo-1.webp, photo-2.webp, … in order. */
  photos: { alt: string }[];
}

export interface Sponsors {
  title: string;
  items: Sponsor[];
}

export interface Team {
  title: string;
  /** Same shape as the directors sheet, so the API can replace this later. */
  members: Director[];
}

export interface FAQSection {
  title: string;
  /** Shown grouped by category, in the order categories first appear. */
  items: FAQ[];
}

export interface FooterInfo {
  /** Bodies support [text](url) links, rendered with formatContent. */
  columns: { title: string; body: string }[];
  socials: (LinkItem & { icon: string })[];
}

export async function getSettings(): Promise<Settings> {
  return site.settings;
}

export async function getAbout(): Promise<About> {
  return site.about;
}

export async function getPrograms(): Promise<Programs> {
  return site.programs;
}

export async function getWeekend(): Promise<Weekend> {
  return site.weekend;
}

export async function getStats(): Promise<Stats> {
  return site.stats;
}

export async function getSponsors(): Promise<Sponsors> {
  return {
    title: site.sponsors.title,
    items: site.sponsors.items.map((sponsor) => ({
      ...sponsor,
      tier: getTiers(sponsor.tier),
    })),
  };
}

export async function getTeam(): Promise<Team> {
  return site.team;
}

export async function getFAQ(): Promise<FAQSection> {
  return site.faq;
}

export async function getFooter(): Promise<FooterInfo> {
  return site.footer;
}
