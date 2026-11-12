import { Link } from "@/components/Link";
import { Tier } from "./Types";

export const getTiers = (tier: string) => {
  switch (tier.toLowerCase()) {
    case "pearl":
      return Tier.PEARL;
    case "gold":
      return Tier.GOLD;
    case "silver":
      return Tier.SILVER;
    case "custom":
      return Tier.CUSTOM;
    default:
      throw new Error(`Unknown tier: ${tier}`);
  }
};

// Turns **bold**, *italic* and ***both*** into spans. Each marker toggles its
// style, so an unclosed one runs to the end of the text.
const formatEmphasis = (text: string, nextKey: () => number) => {
  const parts: JSX.Element[] = [];
  let isItalic = false;
  let isBold = false;

  text.split(/(\*\*\*|\*\*|\*)/).forEach((segment) => {
    if (segment === "***") {
      isBold = !isBold;
      isItalic = !isItalic;
    } else if (segment === "**") {
      isBold = !isBold;
    } else if (segment === "*") {
      isItalic = !isItalic;
    } else if (segment) {
      parts.push(
        <span
          key={nextKey()}
          className={`${isBold ? "font-bold" : ""} ${isItalic ? "italic" : ""}`}
        >
          {segment}
        </span>
      );
    }
  });

  return parts;
};

// Turns [text](url) links and **bold** / *italic* into elements, for text
// that already sits inside a paragraph.
export const formatInline = (text: string) => {
  const parts: JSX.Element[] = [];
  let key = 0;
  const nextKey = () => key++;

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let linkMatch;
  let lastIndex = 0;

  while ((linkMatch = linkRegex.exec(text)) !== null) {
    parts.push(...formatEmphasis(text.substring(lastIndex, linkMatch.index), nextKey));
    parts.push(
      <Link key={nextKey()} href={linkMatch[2]}>
        {linkMatch[1]}
      </Link>
    );
    lastIndex = linkMatch.index + linkMatch[0].length;
  }
  parts.push(...formatEmphasis(text.substring(lastIndex), nextKey));

  return parts;
};

// Formats a block of text: each line becomes a paragraph, or a bullet if it
// starts with "-", with links and emphasis inside.
export const formatContent = (text: string) => {
  // Split the text into lines
  const lines = text.split("\n");

  return lines.map((line, index) => {
    // Check if line starts with a bullet point
    const isBulletPoint = line.trim().startsWith("-");

    // Process the line content
    let processedLine = line;
    if (isBulletPoint) {
      // Remove the bullet point for styling
      processedLine = line.trim().substring(1).trim();
    }

    // Process markdown in the line
    const formattedContent = formatInline(processedLine);

    return isBulletPoint ? (
      <li key={index} className="ml-6 list-disc my-1">
        {formattedContent}
      </li>
    ) : (
      <p key={index} className="my-1">
        {formattedContent}
      </p>
    );
  });
};
