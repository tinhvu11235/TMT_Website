"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactFormValues } from "@/lib/validation/contact";
import type { Service } from "@/types/content";

export function ContactForm({ services }: { services: Service[] }) {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { privacy: true, website: "" }
  });

  async function onSubmit(values: ContactFormValues) {
    setState("idle");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    if (response.ok) {
      reset({ privacy: true, website: "" });
      setState("success");
      return;
    }

    setState("error");
  }

  return (
    <form className="grid gap-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Họ tên" error={errors.name?.message}>
          <input className="input" {...register("name")} />
        </Field>
        <Field label="Điện thoại" error={errors.phone?.message}>
          <input className="input" {...register("phone")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className="input" type="email" {...register("email")} />
        </Field>
        <Field label="Công ty" error={errors.company?.message}>
          <input className="input" {...register("company")} />
        </Field>
      </div>
      <Field label="Dịch vụ quan tâm" error={errors.service?.message}>
        <select className="input" {...register("service")}>
          <option value="">Chọn dịch vụ</option>
          {services.map((service) => (
            <option value={service.title} key={service.id}>
              {service.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Nội dung" error={errors.message?.message}>
        <textarea className="input min-h-36 resize-y" {...register("message")} />
      </Field>
      <label className="flex gap-3 text-sm leading-6 text-[var(--color-muted-foreground)]">
        <input type="checkbox" className="mt-1 h-4 w-4" {...register("privacy")} />
        Tôi đồng ý để website lưu thông tin nhằm liên hệ tư vấn theo nội dung đã gửi.
      </label>
      {errors.privacy?.message ? <p className="text-sm text-red-600">{errors.privacy.message}</p> : null}
      {state === "success" ? <p className="rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Đã nhận thông tin. Chúng tôi sẽ liên hệ sớm.</p> : null}
      {state === "error" ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">Chưa gửi được thông tin. Vui lòng thử lại sau.</p> : null}
      <Button type="submit" disabled={isSubmitting} className="w-full md:w-fit">
        <Send size={17} />
        {isSubmitting ? "Đang gửi..." : "Gửi thông tin"}
      </Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[var(--color-foreground)]">
      {label}
      {children}
      {error ? <span className="font-medium text-red-600">{error}</span> : null}
    </label>
  );
}
