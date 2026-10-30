"use client";

import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Section>
      <Container className="max-w-2xl">
        <div className="rounded-lg border border-red-200 bg-white p-8">
          <h1 className="text-3xl font-bold text-[var(--color-secondary)]">Có lỗi xảy ra</h1>
          <p className="mt-3 text-slate-600">Website chưa thể tải nội dung. Vui lòng thử lại hoặc liên hệ quản trị viên.</p>
          <Button className="mt-6" onClick={reset}>
            Thử lại
          </Button>
        </div>
      </Container>
    </Section>
  );
}
