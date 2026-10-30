import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { contactSchema } from "@/lib/validation/contact";
import { createContactRequest } from "@/services/content";

const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + env.CONTACT_RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= env.CONTACT_RATE_LIMIT_MAX) return false;
  current.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (!rateLimit(ip)) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const payload = {
    name: parsed.data.name,
    phone: parsed.data.phone,
    email: parsed.data.email || null,
    company: parsed.data.company || null,
    service: parsed.data.service || null,
    message: parsed.data.message,
    ip,
    user_agent: request.headers.get("user-agent") ?? null,
    status: "new",
    created_at: new Date().toISOString()
  };

  try {
    await createContactRequest(payload);
  } catch {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ message: "Contact service unavailable" }, { status: 503 });
    }
  }

  return NextResponse.json({ ok: true });
}
