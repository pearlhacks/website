import { HeartIcon } from "@heroicons/react/24/outline";
import { FooterContent } from "./FooterContent";
import { SocialMediaBar } from "./SocialMediaBar";
import { Link } from "../Link";
import {
  link_mailinglist,
  mlh_codeofconduct,
  social_email,
} from "@/utils/Urls";

interface FooterProps {
  backgroundColor?: "landing" | "generic";
}

export function Footer({ backgroundColor = "generic" }: FooterProps) {
  const bgColor = backgroundColor === "landing" ? "bg-brown-light" : "bg-cream";

  return (
    <div className={`w-full ${bgColor} bg-cover bg-top items-center bg-no-repeat px-5 pt-[150px] sm:pt-[250px] md:pt-[400px] lg:pt-[500px] pb-5 md:pb-10 bg-[url('/images/PH26_Footer_1.svg')]`}>
      <div className="flex flex-col space-y-5 md:space-y-4 divide-[#8B6F5C] divide-y">
        <div className="grid grid-cols-1 md:grid-cols-3 justify-left md:justify-center items-start gap-2 md:gap-4">
          <span className="hidden sm:block">
            <FooterContent title="Keep up with us">
              Join <Link href={link_mailinglist}>our mailing list</Link>!
            </FooterContent>
          </span>
          <FooterContent title="Administration">
            Pearl Hacks abides by{" "}
            <Link href={mlh_codeofconduct}>the MLH Code of Conduct</Link>. If
            you have any questions or feedback, please contact us at{" "}
            <Link href={social_email}>questions@pearlhacks.com</Link>.
          </FooterContent>
          <FooterContent title="Inclusivity Statement">
            Pearl Hacks is an event designed to uplift{" "}
            <span className="font-bold">women and gender non-conforming</span>{" "}
            students in tech. We expect all mentors, volunteers,
            participants, directors, sponsors, judges, and visitors to be
            respectful of our participants&apos; identities and expressions.
          </FooterContent>
        </div>
        <div className="flex  py-2 md:py-5 text-brown-footer w-full flex-col justify-start md:flex-row md:justify-between items-center">
          <span className="flex flex-row items-center space-x-1">
            <p>Made with</p> <HeartIcon className="w-4 h-4" />{" "}
            <p>by Pearl Hacks</p>
          </span>
          <SocialMediaBar />
        </div>
      </div>
    </div>
  );
}
