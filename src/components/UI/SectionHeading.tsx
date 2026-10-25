interface SectionHeadingProps {
  id: string;
  title: string;
  light?: boolean;
}

export function SectionHeading({ id, title, light = false }: SectionHeadingProps) {
  return (
    <h2
      id={id}
      className={`font-sans font-bold text-3xl md:text-4xl text-balance break-words ${
        light ? "text-postal-sky" : "text-postal-navy"
      }`}
    >
      {title}
    </h2>
  );
}
