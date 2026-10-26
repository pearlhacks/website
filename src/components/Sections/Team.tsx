import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";
import { PopIn } from "@/components/Scroll/PopIn";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Team as TeamContent } from "@/lib/content";

interface TeamProps {
  team: TeamContent;
}

// The whole team, kept compact: a small photo, name, pronouns and role each.
// Members without a photo get a placeholder silhouette. They pop in one by
// one the first time the grid scrolls into view.
export function Team({ team }: TeamProps) {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="w-full scroll-mt-16 bg-postal-navy text-postal-sky [--focus-ring:theme(colors.postal.sky.DEFAULT)]"
    >
      <div className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading id="team-heading" title={team.title} light />
        <PopIn>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {team.members.map((member, index) => (
              <li key={`${member.name}-${index}`} data-pop className="text-center">
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full bg-postal-sky/15">
                  {member.image_url ? (
                    <Image src={member.image_url} alt="" fill sizes="96px" className="object-cover" />
                  ) : (
                    <UserIcon aria-hidden="true" className="absolute inset-x-0 bottom-0 mx-auto h-20 w-20 text-postal-sky/40" />
                  )}
                </div>
                <p className="mt-3 font-sans font-bold break-words">{member.name}</p>
                <p className="text-sm break-words">{member.pronouns}</p>
                <p className="text-sm font-normal break-words">{member.role}</p>
              </li>
            ))}
          </ul>
        </PopIn>
      </div>
    </section>
  );
}
