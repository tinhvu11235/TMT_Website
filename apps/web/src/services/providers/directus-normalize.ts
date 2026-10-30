import { assetUrl } from "@/lib/directus/client";
import type { ImageAsset, Project, ProjectStatus } from "@/types/content";

export class DirectusDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DirectusDataError";
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function optionalNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function normalizeImageAsset(value: unknown, fallbackAlt: string): ImageAsset | null {
  if (!value) return null;

  if (typeof value === "string") {
    const src = assetUrl(value);
    return src ? { src, alt: fallbackAlt } : null;
  }

  const record = asRecord(value);
  if (!record) throw new DirectusDataError("Expected a Directus image asset object or ID");

  const source = typeof record.src === "string" ? record.src : typeof record.id === "string" ? record.id : null;
  const src = assetUrl(source);
  if (!src) throw new DirectusDataError("Directus image asset is missing both src and id");

  const altCandidates = [record.alt, record.description, record.title, record.filenameDownload];
  const alt = altCandidates.find((candidate): candidate is string => typeof candidate === "string" && candidate.trim().length > 0);

  return {
    id: typeof record.id === "string" ? record.id : undefined,
    src,
    alt: alt ?? fallbackAlt,
    width: optionalNumber(record.width),
    height: optionalNumber(record.height)
  };
}

export function normalizeImageAssets(value: unknown, fallbackAlt: string): ImageAsset[] {
  if (!value) return [];
  if (!Array.isArray(value)) throw new DirectusDataError("Expected a Directus image asset array");
  return value.map((image, index) => normalizeImageAsset(image, `${fallbackAlt} ${index + 1}`)).filter((image): image is ImageAsset => image !== null);
}

const projectStatuses = new Set<ProjectStatus>(["planning", "in_progress", "completed"]);
const publicationStatuses = new Set(["draft", "published", "archived"]);

export function normalizeProjectStatus(project: Project): Project {
  const record = project as unknown as Record<string, unknown>;
  const rawStatus = record.status;
  const progressCandidate = record.projectStatus ?? record.progressStatus ?? rawStatus;
  const publicationCandidate = record.publishStatus ?? record.publicationStatus;

  if (typeof progressCandidate !== "string" || !projectStatuses.has(progressCandidate as ProjectStatus)) {
    const legacyPublication = typeof rawStatus === "string" && publicationStatuses.has(rawStatus);
    throw new DirectusDataError(
      legacyPublication
        ? "Project DTO uses status for publication but does not provide projectStatus/progressStatus"
        : "Project DTO is missing a valid progress status"
    );
  }

  const publishStatus =
    typeof publicationCandidate === "string" && publicationStatuses.has(publicationCandidate)
      ? (publicationCandidate as Project["publishStatus"])
      : undefined;

  return {
    ...project,
    status: progressCandidate as ProjectStatus,
    publishStatus
  };
}

