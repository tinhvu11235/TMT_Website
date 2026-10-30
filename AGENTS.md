# Hướng dẫn làm việc với source

## Đọc trước

- `README.md`: cài đặt, chạy local, Git và kiểm tra.
- `docs/AI_HANDOFF.md`: hiện trạng, hạn chế và backlog có tiêu chí hoàn tất.
- `docs/architecture.md`: ranh giới trách nhiệm.

Đây là MVP website doanh nghiệp xây dựng dùng Next.js App Router, React, TypeScript, Tailwind, Zod và Directus/PostgreSQL. Không coi dữ liệu demo hoặc build thành công là bằng chứng CMS/production đã hoàn thiện.

## Quy ước kiến trúc

- `apps/web/config/site.config.json` là nguồn chuẩn cho thương hiệu, liên hệ chính, navigation, theme, SEO/nội dung tĩnh và các block trang chủ. Kiểm tra dữ liệu qua `src/site-config/site.schema.ts`; đổi version phải có kế hoạch migration và test.
- `apps/web/src/services/content.ts` là facade dữ liệu collection. Truy cập Directus qua `src/lib/directus/client.ts`, chuẩn hóa DTO/media trong `src/services/providers/` và kiểu trong `src/types/content.ts`.
- Giữ homepage server-first qua `src/features/home/load-home-page-model.ts` và block renderer. Client component chỉ dùng khi có tương tác.
- `/customize` là editor development import/preview/export, không tự ghi source và phải trả 404 trong production. Giữ guard cả route lẫn proxy, kiểm tra same-origin và payload cho preview.
- Không đưa server token vào client, biến `NEXT_PUBLIC_*`, SiteConfig hoặc Git. Collection `contact_requests` phải riêng tư.
- Ưu tiên thay đổi nhỏ đúng yêu cầu. Không tự đổi hệ thống CMS, cấu trúc routing, framework hoặc nâng đồng loạt dependency.

## Cài đặt và kiểm tra

- Chạy tại gốc với Node >=22 và pnpm **10.22.0**.
- `pnpm install --frozen-lockfile`; nếu có thay dependency, dùng pnpm đúng phiên bản để cập nhật cả manifest và lockfile.
- Local Next env là `apps/web/.env.local`; root `.env` dành cho Compose. Dùng env example tương ứng, không copy hostname `directus` vào cấu hình local trên host.
- `pnpm check` chạy lint, Next typegen + TypeScript, Vitest và production build. Khi đổi code/config phải chạy các kiểm tra liên quan; trước bàn giao thay đổi lớn chạy đủ bốn bước.
- Khi đổi nghiệp vụ, bổ sung test cho hành vi có ý nghĩa. Không viết test chỉ để khớp cách triển khai.
- Các test hiện tại không thay thế integration/E2E với Directus và Docker. Ghi rõ những gì đã kiểm tra và chưa kiểm tra.
- Không commit `node_modules`, `.next`, `.runtime`, `*.tsbuildinfo`, file môi trường thật, chứng chỉ, dữ liệu CMS hoặc database dump. Không xóa assets trong `public/` như một phần dọn cache.

## Kết thúc thay đổi

Cập nhật tài liệu liên quan và trạng thái backlog trong `docs/AI_HANDOFF.md` khi giải quyết một mục. Ghi kết quả kiểm tra thực tế và việc còn tồn đọng, không đánh dấu đã hoàn thành khi chỉ có dữ liệu fallback. Mặc định trao đổi và bàn giao bằng tiếng Việt; giữ tên kỹ thuật trong source.
