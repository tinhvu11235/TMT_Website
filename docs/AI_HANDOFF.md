# Bàn giao cho AI tiếp tục phát triển

Cập nhật ngày 30/10/2026. Đây là codebase MVP cho website doanh nghiệp xây dựng Việt Nam, có Next.js frontend, Directus CMS dự kiến tích hợp, PostgreSQL và Docker Compose. **Hệ thống chưa sẵn sàng production.** Tài liệu này ghi nhận implementation trong source, không xác nhận đã có CMS/database được cấu hình hoặc đã kiểm thử deploy thực tế.

## Bắt đầu từ đâu

1. Đọc `AGENTS.md`, `README.md`, tài liệu này và `docs/architecture.md`.
2. Đọc `apps/web/package.json`, `apps/web/config/site.config.json`, `apps/web/src/types/content.ts` và `docs/cms-schema.md` trước khi thay đổi hợp đồng dữ liệu.
3. Cài dependency đúng `pnpm-lock.yaml` bằng phiên bản pnpm được khai báo trong root `package.json`. Dependency cài đặt và file build không thuộc source cần đẩy Git.
4. Chạy baseline: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Ghi lại kết quả thực tế của môi trường đang dùng; đừng coi tài liệu này là bằng chứng các lệnh đã pass.
5. Chọn một đầu việc trong backlog, triển khai cùng kiểm tra phù hợp, cập nhật tài liệu nếu hợp đồng hoặc hành vi thay đổi.

## Những gì đã có trong source

| Phần | Implementation |
| --- | --- |
| Website công khai | Next.js App Router, TypeScript, Tailwind; trang chủ, giới thiệu, dịch vụ, dự án, năng lực, tin tức, thư viện, đối tác, liên hệ, tìm kiếm, hồ sơ năng lực, chính sách bảo mật. |
| SiteConfig | JSON version 1 được kiểm tra bằng Zod; thông tin công ty, brand, contact, navigation, theme, SEO/copy trang tĩnh và block homepage. |
| Homepage | Lập kế hoạch lấy dữ liệu cho block bật, tạo server model, render theo thứ tự cấu hình; collection records vẫn thuộc CMS. |
| Editor development | `/customize` hỗ trợ sửa cấu hình, block, preview và import/export JSON. Có guard tắt production. Editor không ghi file source hoặc lưu vào CMS. |
| Content provider | Directus REST, đổi snake_case sang camelCase, normalize ảnh và tiến độ dự án, fallback seed khi request lỗi. |
| API liên hệ | Validation Zod, giới hạn tần suất trong memory, ghi `contact_requests`. Chưa có SMTP. |
| Revalidation | Endpoint có secret, map collection/path và hỗ trợ slug của dịch vụ/dự án/tin tức. Chưa tự tạo Flow Directus. |
| Kiểm thử | Unit/component tests cho SiteConfig, editor, home renderer, provider helpers, validation, slug và SEO. Chưa có bộ integration/E2E chứng minh CMS và production deploy hoạt động đầy đủ. |
| CI và kiểm tra tổng | `pnpm check` và `.github/workflows/ci.yml` đã được cấu hình cho lint/typecheck/test/build. Cần xem kết quả chạy thực tế trên GitHub sau khi push. |

## Bản đồ source

- `apps/web/src/app/`: route công khai, API, metadata, sitemap/robots và trang editor.
- `apps/web/config/site.config.json`: cấu hình website chính thức được version trong Git.
- `apps/web/src/site-config/`: schema, defaults, adapter, route/metadata helpers và loader.
- `apps/web/src/features/home/`: data planner, renderer và từng section homepage.
- `apps/web/src/features/customize/`: editor, reducer, import/export, preview và kiểm tra message.
- `apps/web/src/services/content.ts`: facade dữ liệu collection; `seed.ts` chứa nội dung mẫu.
- `apps/web/src/lib/directus/client.ts`: REST client/cache/header; `services/providers/directus-normalize.ts` xử lý DTO.
- `apps/web/src/types/content.ts`: model frontend, không phải migration CMS.
- `apps/web/src/config/env.ts`: biến môi trường được frontend/server đọc và validate.
- `infra/directus/collections.json`: schema reference; chưa import được như snapshot.
- `docker-compose*.yml`, `apps/web/Dockerfile`, `infra/nginx/default.conf`: nền tảng hạ tầng cần kiểm thử riêng.
- `docs/admin-guide.md`, `docs/content-guide.md`, `docs/cms-schema.md`: quy trình vận hành và hợp đồng hiện tại.

## Ranh giới cần giữ khi phát triển

SiteConfig quản lý cấu hình website; Directus quản lý collection records. Không đưa toàn bộ dịch vụ/dự án/bài viết vào SiteConfig để thay CMS. Frontend hiện không dùng `global_settings`, `menu_items`, `homepage_content`, `homepage_sections` hoặc `pages` để quản lý giao diện. Route vẫn do code quyết định.

Export editor chỉ tạo file JSON để người phát triển review, thay file chính thức, commit và build/deploy lại. Giữ guard production, schema validation và kiểm tra same-origin của preview khi mở rộng editor. Ảnh SiteConfig hiện chấp nhận đường dẫn local hoặc `picsum.photos`; ảnh CMS đi qua provider khác.

Giữ package manifests, lockfile, tests và public assets trong Git. Không đưa `node_modules`, runtime riêng, cache, output build, `.env`, token, private key, database dump hoặc dữ liệu khách hàng vào commit.

## Backlog ưu tiên và tiêu chí hoàn tất

| Ưu tiên | Công việc | Tiêu chí hoàn tất |
| --- | --- | --- |
| 1 | Directus snapshot/bootstrap và quyền | Khởi tạo được từ database rỗng; có field, labels, roles, permissions và dữ liệu kiểm thử; public không đọc draft/contact; token server có quyền tối thiểu; tài liệu khớp schema thật. |
| 1 | Chốt DTO dự án, quan hệ và file | Fixture từ API thật cho ảnh đơn, gallery, category, services relation và PDF; mapper được test; tiến độ và xuất bản tách riêng; draft không lọt qua provider. `pdf_url` xử lý đúng file mới. |
| 1 | Xác nhận Docker và URL production | Clean build từ lockfile; Next standalone khởi động; URL CMS public/internal đúng; cấu hình ảnh hoạt động với domain thật; Nginx/CMS routing và TLS được kiểm thử; backup/restore được diễn tập. |
| 2 | Chính sách fallback và lỗi CMS | Chốt hành vi production khi CMS lỗi/rỗng; không âm thầm trình bày demo như dữ liệu thật; xử lý ngoại lệ `company_profiles` rỗng; có logging đủ để phân biệt lỗi mạng/quyền/DTO. |
| 2 | Pagination và validation response | Không thiếu bản ghi khi vượt giới hạn list mặc định; kiểm thử dữ liệu nhiều trang và response không hợp lệ; quy tắc sort/filter nhất quán. |
| 2 | Flow revalidation | Cấu hình Flow có thể tái tạo; publish/update/delete cập nhật đúng homepage, list, detail và các trang dùng chung dữ liệu; request sai secret bị từ chối. |
| 2 | Hoàn thiện contact | Gửi thật tạo được CMS record; failure không báo thành công cho người dùng; bổ sung thông báo SMTP nếu yêu cầu; rate limit phù hợp nhiều instance và có kiểm tra proxy/IP. |
| 3 | Nội dung doanh nghiệp và trải nghiệm | Thay placeholder/ảnh/PDF/số liên hệ; kiểm tra giao diện mobile/desktop, links, metadata và accessibility; chỉ triển khai video gallery hoặc trang động khi được đưa vào phạm vi. |
| 3 | Kiểm thử tích hợp và xác minh CI | Workflow CI hiện có chạy thành công trên checkout sạch với frozen lockfile; E2E phủ các luồng chính và xác nhận `/customize` trả 404 ở production; ghi rõ môi trường và kết quả. |

## Các giới hạn đã thấy trong code

- Phần lớn Directus list request chưa đặt pagination/limit tường minh. Model TypeScript đang được dùng với type assertion, chưa validate toàn bộ response runtime.
- CMS request lỗi dùng demo fallback cả production. List trả `[]` thì giữ rỗng, nhưng `getCompanyProfile()` vẫn dùng demo khi không có bản ghi.
- `company_profiles.pdf_url` hiện chỉ nhận chuỗi; file ID/object không tự biến thành URL PDF. Gallery junction và category relation chưa có mapper tổng quát.
- `normalizeProjectStatus()` hỗ trợ field tiến độ và field xuất bản riêng. Không mặc định `status=draft/published/archived` được bảo toàn nếu CMS dùng field tiến độ khác; cần test hợp đồng cụ thể.
- Contact development vẫn có thể trả `{ ok: true }` khi CMS write lỗi; production trả 503. Rate limit lưu trong `Map` của một process. Các biến SMTP mẫu chưa có code gửi email.
- Endpoint revalidate đã có, nhưng mapping chưa bao phủ mọi trang/collection. Không mô tả đầu việc tiếp theo là viết mới toàn bộ endpoint.
- Hạ tầng cần xác minh build-time/runtime của `NEXT_PUBLIC_*`, standalone output và routing CMS. Nginx hiện cấu hình HTTP; việc mở cổng 443 trong Compose tự nó không cung cấp HTTPS.
- `GalleryItem` có kiểu video/youtube nhưng trang thư viện hiện render ảnh. `PageContent` là type, chưa có hệ thống trang CMS động.

## Cách báo cáo sau mỗi đầu việc

Ghi thay đổi chức năng thực tế, file chính, lệnh kiểm tra và kết quả, phần chưa kiểm thử và bước tiếp theo. Chỉ gọi một tích hợp là hoàn tất sau khi có bằng chứng từ môi trường thật hoặc test có fixture đúng hợp đồng; giao diện đang hiển thị seed không phải bằng chứng tích hợp CMS.

## Kết quả phiên dọn source 30/10/2026

- Môi trường kiểm tra: Windows, Node.js 24.22.1, pnpm 10.22.0.
- `pnpm install --frozen-lockfile`: thành công sau khi bỏ các khai báo dependency không dùng và cập nhật lockfile bằng pnpm 10.22.0.
- `pnpm check`: thành công; ESLint, Next route typegen + TypeScript, 11 file test với **36 test pass**, và production build tạo 38 static pages.
- Chưa kiểm thử Docker image, Directus thực tế, SMTP, TLS, E2E hoặc workflow chạy trên GitHub/Node 22. Build thành công không xác nhận các tích hợp đó.
- Đã thêm cấu hình Git/Docker ignore, chuẩn hóa xuống dòng, CI và hướng dẫn cài đặt local riêng với Compose. Sửa script Windows và alias Vitest để bỏ phụ thuộc đường dẫn máy phát triển.
- Dependency đã cài, build output, browser profiles và cache trong `.runtime` được dọn khỏi source bằng cách chuyển vào Thùng rác. Manifests, lockfile, tests và public assets được giữ lại.
- Repository local dùng nhánh `main`; chưa tạo commit, chưa cấu hình remote và chưa push.
