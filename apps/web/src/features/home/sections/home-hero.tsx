import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  ClipboardPenLine,
  Cog,
  HardHat,
  Route,
} from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ImageFrame } from "@/components/ui/image-frame";
import type { HomeBlock } from "@/site-config/site.schema";

type HeroConfig = Extract<HomeBlock, { type: "hero" }>["config"];

const canonicalTitle =
  "Đồng hành từ khảo sát, thiết kế đến giám sát và quản lý dự án";

const serviceHighlights: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Tư vấn thiết kế", icon: ClipboardPenLine },
  { label: "Giám sát thi công", icon: HardHat },
  { label: "Quản lý dự án", icon: Cog },
  { label: "Công trình dân dụng", icon: Building2 },
  { label: "Hạ tầng kỹ thuật", icon: Route },
];

function HeroTitle({ title }: { title: string }) {
  if (title === canonicalTitle) {
    return (
      <span aria-hidden="true">
        <span className="lg:hidden">
          Đồng hành từ khảo sát, thiết kế đến{" "}
          <span className="text-[#f97316]">giám sát</span> và{" "}
          <span className="text-[#f97316]">quản lý dự án</span>
        </span>
        <span className="hidden lg:block">
          <span className="block">Đồng hành từ khảo sát,</span>
          <span className="block">
            thiết kế đến <span className="text-[#f97316]">giám sát</span>
          </span>
          <span className="block">
            và <span className="text-[#f97316]">quản lý dự án</span>
          </span>
        </span>
      </span>
    );
  }

  return <>{title}</>;
}

export function HomeHero({ config }: { config: HeroConfig }) {
  const mobileImage = config.mobileImage ?? config.image;

  return (
    <section className="relative isolate w-full max-w-full overflow-hidden bg-[#f4f4f2] text-[#24272b] lg:min-h-[clamp(35rem,30.8vw,39.125rem)]">
      <ImageFrame
        image={config.image}
        priority
        className="absolute inset-y-0 right-0 hidden w-[56%] rounded-none bg-slate-800 [clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)] [&>img]:object-right lg:block"
        sizes="56vw"
      />

      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[44.8%] z-10 hidden w-[7.5%] bg-[#f97316] [clip-path:polygon(88%_0,100%_0,12%_100%,0_100%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 z-10 hidden w-[9%] bg-[#252a2e]/95 [clip-path:polygon(56%_0,100%_0,100%_100%,0_100%,66%_58%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 z-20 hidden h-[15%] w-[8.5%] bg-[#f97316] [clip-path:polygon(0_0,78%_0,100%_100%,25%_100%)] lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 z-10 hidden h-[36%] w-[4.75%] bg-[#f97316] [clip-path:polygon(0_0,100%_100%,52%_100%,0_43%)] lg:block"
      />

      <Container className="relative z-20 max-w-none px-[clamp(1rem,4.25vw,5.5rem)] py-10 sm:py-14 lg:flex lg:min-h-[clamp(35rem,30.8vw,39.125rem)] lg:items-center lg:py-7">
        <div className="min-w-0 max-w-full lg:w-[49%]">
          <p className="max-w-full text-[0.78rem] font-extrabold uppercase tracking-[0.06em] text-[#ee7410] sm:text-base sm:tracking-[0.1em] lg:text-[clamp(1rem,1.2vw,1.5rem)]">
            {config.eyebrow}
          </p>

          <h1
            aria-label={config.title}
            className="mt-3 max-w-full break-words text-[clamp(2.15rem,3.55vw,4.35rem)] font-extrabold leading-[1.03] tracking-[-0.045em] text-[#24272b]"
          >
            <HeroTitle title={config.title} />
          </h1>

          <p className="mt-5 max-w-[52rem] break-words text-base leading-7 text-[#292d31] sm:text-lg sm:leading-8 lg:mt-5 lg:text-[clamp(1rem,0.92vw,1.125rem)] lg:leading-7">
            {config.description}
          </p>

          <div className="mt-7 grid min-w-0 grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:mt-6 lg:grid-cols-5 lg:gap-0">
            {serviceHighlights.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex min-h-14 min-w-0 items-center gap-2 pr-1 lg:justify-center lg:gap-3 lg:border-l lg:border-[#d8d2c8] lg:px-3 lg:first:justify-start lg:first:border-l-0 lg:first:pl-0"
              >
                <Icon
                  aria-hidden="true"
                  className="size-8 shrink-0 stroke-[2.2] text-[#ee7410] lg:size-9"
                />
                <span className="min-w-0 max-w-28 break-words text-[0.68rem] font-extrabold uppercase leading-[1.35] text-[#24272b] sm:text-xs lg:text-[clamp(0.65rem,0.68vw,0.86rem)]">
                  {label}
                </span>
              </div>
            ))}
          </div>

          <LinkButton
            href={config.primaryCta.href}
            variant="accent"
            className="mt-8 h-14 rounded-xl border-[#f97316] bg-[#f97316] px-7 text-base font-extrabold uppercase text-white shadow-[0_12px_30px_rgba(249,115,22,0.2)] hover:bg-[#e86309] hover:brightness-100 sm:h-16 sm:px-9 sm:text-lg lg:mt-7 lg:h-[4.5rem] lg:px-12 lg:text-xl"
          >
            {config.primaryCta.label}
            <ArrowRight aria-hidden="true" className="ml-2 size-6" />
          </LinkButton>
        </div>
      </Container>

      <div className="relative h-72 border-t-[6px] border-[#f97316] sm:h-96 lg:hidden">
        <ImageFrame
          image={mobileImage}
          priority
          className="absolute inset-0 rounded-none bg-slate-800 [&>img]:object-right"
          sizes="100vw"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-12 bg-[#252a2e]/90 [clip-path:polygon(60%_0,100%_0,100%_100%,0_100%)]"
        />
      </div>
    </section>
  );
}
