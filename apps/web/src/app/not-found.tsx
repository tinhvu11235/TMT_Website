import { LinkButton } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Section>
      <Container className="max-w-2xl">
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-primary)]">404</p>
          <h1 className="mt-3 text-4xl font-bold text-[var(--color-secondary)]">Không tìm thấy trang</h1>
          <p className="mt-4 text-slate-600">Nội dung có thể đã đổi đường dẫn hoặc chưa được xuất bản trong CMS.</p>
          <LinkButton href="/" className="mt-6">
            Về trang chủ
          </LinkButton>
        </div>
      </Container>
    </Section>
  );
}
