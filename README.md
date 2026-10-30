# Construction Corporate Platform

Nền tảng website doanh nghiệp xây dựng, tư vấn kỹ thuật và quản lý dự án. Giao diện dùng chung; thương hiệu và bố cục nằm trong SiteConfig, dữ liệu nghiệp vụ lấy từ Directus CMS.

Đây là source MVP để tiếp tục phát triển. Frontend có dữ liệu demo để chạy khi chưa có CMS; tích hợp CMS và vận hành production còn các việc trong [bàn giao AI](docs/AI_HANDOFF.md).

## Yêu cầu

- Node.js 22 trở lên (`.node-version` dùng nhánh 22).
- **pnpm 10.22.0** theo `packageManager`; giữ và commit `pnpm-lock.yaml`.
- Docker + Compose nếu chạy Directus/PostgreSQL; frontend demo không bắt buộc Docker.

Nếu máy đã có npm, có thể cài pnpm bằng `npm install --global pnpm@10.22.0`. Kiểm tra `node --version` và `pnpm --version` trước khi cài source.

## Chạy frontend

Từ thư mục gốc:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Mở http://localhost:3000. Không có CMS thì website hiển thị dữ liệu mẫu, không chứng minh dữ liệu đã được lưu vào CMS.

Khi cần cấu hình local, sao chép `apps/web/.env.example` thành `apps/web/.env.local`, rồi khởi động lại server. Trên PowerShell:

```powershell
Copy-Item apps/web/.env.example apps/web/.env.local
```

Trên macOS/Linux dùng `cp apps/web/.env.example apps/web/.env.local`. Next.js đọc biến môi trường tại `apps/web`; `.env` ở gốc dành cho Docker Compose.

Windows có thể chạy `run-dev.bat` để cài dependency bằng lockfile, dùng cache trong `.runtime` và mở dev server với editor được bật. Script yêu cầu Node/pnpm có sẵn trong PATH.

## Chỉnh thương hiệu và trang chủ

File chuẩn được lưu trong Git: `apps/web/config/site.config.json`. Schema và validation: `apps/web/src/site-config/`.

Đặt `ENABLE_SITE_EDITOR=true` trong `apps/web/.env.local`, chạy `pnpm dev`, rồi mở http://localhost:3000/customize. Editor cho phép import, preview và export JSON; sau khi export cần thay nội dung file cấu hình trong source. Editor không tự ghi file và trả 404 trong production.

Directus quản lý các bản ghi dịch vụ, dự án, bài viết, chứng chỉ, nhân sự, đối tác, thư viện, văn phòng và hồ sơ năng lực. Không chuyển thương hiệu/menu/bố cục trang chủ từ SiteConfig sang CMS trong các thay đổi thông thường.

## Kiểm tra source

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Hoặc `pnpm check` để chạy lần lượt cả bốn bước. `typecheck` tự sinh Next.js route types nên chạy được khi chưa có `.next`. GitHub Actions chạy cùng quy trình khi push/PR; không cần CMS cho các kiểm tra này.

## Chạy với Docker

Sao chép `.env.example` ở gốc thành `.env`, đổi mật khẩu/secret mẫu, rồi chạy:

```sh
docker compose up --build
```

- Web: http://localhost:3000
- Directus: http://localhost:8055
- Nginx: http://localhost:8080

Compose khởi tạo dịch vụ nhưng **chưa tự tạo collections/roles/permissions**. `infra/directus/collections.json` là tài liệu tham chiếu, chưa phải snapshot có thể import. Xem [CMS schema](docs/cms-schema.md).

Không dùng `CMS_INTERNAL_URL=http://directus:8055` khi chạy frontend trực tiếp trên máy; local dùng `http://localhost:8055`. Các biến `NEXT_PUBLIC_*` được dùng lúc build Docker, cần rebuild khi đổi domain CMS/site.

## Chuẩn bị đưa lên Git

Source đã có `.gitignore`, `.gitattributes`, `.dockerignore` và CI. Dependency đã cài, cache, build output, `.env` thật và chứng chỉ không thuộc source cần upload. Giữ `package.json`, `pnpm-lock.yaml`, assets trong `public/` và `.env.example`.

Thư mục này được chuẩn bị thành repository nhánh `main`, chưa tạo commit hay cấu hình remote. Kiểm tra file trước khi commit:

```sh
git status --short
git add .
git diff --cached --stat
git commit -m "chore: prepare source and AI handoff"
```

Sau khi tạo repository trống trên dịch vụ Git của bạn, thay URL mẫu bằng URL thật:

```sh
git remote add origin <repository-url>
git push -u origin main
```

## AI tiếp tục phát triển

Đọc [AGENTS.md](AGENTS.md) và [docs/AI_HANDOFF.md](docs/AI_HANDOFF.md) trước khi sửa. Tài liệu bàn giao ghi điểm vào source, chức năng đã có, giới hạn và thứ tự ưu tiên kèm tiêu chí hoàn tất.

- [Kiến trúc](docs/architecture.md)
- [Hướng dẫn quản trị](docs/admin-guide.md)
- [Hướng dẫn nội dung](docs/content-guide.md)
- [Triển khai](docs/deployment.md)
- [Sao lưu/khôi phục](docs/backup-restore.md)

Production còn cần xác minh Directus thực tế, quyền truy cập, TLS và các mục ưu tiên trong bàn giao. SMTP chưa được triển khai; endpoint `/api/revalidate` đã có nhưng cần cấu hình Directus Flow tương ứng.
