import { Reveal } from "./reveal";

/** Shared opener for every page that isn't the home page. */
export function PageHeader({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="shell pb-14 pt-36 md:pb-20 md:pt-52">
      <Reveal>
        <p className="kicker">{kicker}</p>
        <h1 className="mt-6 max-w-4xl font-serif text-title leading-[1.05] text-ink">{title}</h1>
        {lede && (
          <p className="mt-8 max-w-2xl text-[1.125rem] leading-relaxed text-ink-soft md:text-[1.25rem]">
            {lede}
          </p>
        )}
        {children}
      </Reveal>
    </header>
  );
}
