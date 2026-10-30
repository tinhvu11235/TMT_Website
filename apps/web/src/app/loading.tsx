import { Container, Section } from "@/components/ui/container";

export default function Loading() {
  return (
    <Section>
      <Container>
        <div className="grid gap-4">
          <div className="h-10 w-2/3 animate-pulse rounded-md bg-slate-200" />
          <div className="h-5 w-1/2 animate-pulse rounded-md bg-slate-200" />
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-64 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
