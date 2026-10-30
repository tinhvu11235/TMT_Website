import { cmsUrl, env } from "@/config/env";

type DirectusListResponse<T> = {
  data?: T[];
};

type DirectusItemResponse<T> = {
  data?: T;
};

function camelizeKey(key: string) {
  return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
}

function normalizeKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeKeys);
  if (typeof value !== "object" || value === null) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [camelizeKey(key), normalizeKeys(nestedValue)])
  );
}

const defaultHeaders = {
  "Content-Type": "application/json",
  ...(env.DIRECTUS_STATIC_TOKEN
    ? { Authorization: `Bearer ${env.DIRECTUS_STATIC_TOKEN}` }
    : {})
};

function makeUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, cmsUrl);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });
  return url.toString();
}

export async function directusList<T>(
  collection: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const response = await fetch(makeUrl(`/items/${collection}`, params), {
    headers: defaultHeaders,
    next: { revalidate: 120 }
  });

  if (!response.ok) throw new Error(`Directus list failed: ${collection}`);
  const json = (await response.json()) as DirectusListResponse<T>;
  return normalizeKeys(json.data ?? []) as T[];
}

export async function directusItem<T>(
  collection: string,
  id: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  const response = await fetch(makeUrl(`/items/${collection}/${id}`, params), {
    headers: defaultHeaders,
    next: { revalidate: 120 }
  });

  if (!response.ok) throw new Error(`Directus item failed: ${collection}/${id}`);
  const json = (await response.json()) as DirectusItemResponse<T>;
  return normalizeKeys(json.data ?? null) as T | null;
}

export async function directusCreate<T>(
  collection: string,
  payload: Record<string, unknown>
) {
  const response = await fetch(makeUrl(`/items/${collection}`), {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify(payload)
  });

  if (!response.ok) throw new Error(`Directus create failed: ${collection}`);
  const json = (await response.json()) as DirectusItemResponse<T>;
  return json.data ?? null;
}

export function assetUrl(idOrUrl?: string | null) {
  if (!idOrUrl) return null;
  if (idOrUrl.startsWith("http") || idOrUrl.startsWith("/")) return idOrUrl;
  return new URL(`/assets/${idOrUrl}`, env.NEXT_PUBLIC_CMS_URL).toString();
}
