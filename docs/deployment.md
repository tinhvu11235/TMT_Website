# Deployment

Source hiện là MVP; cấu hình Compose chưa được xác minh như một hệ thống production hoàn chỉnh. Xem `AI_HANDOFF.md` cho các việc tích hợp còn thiếu.

## Chuẩn bị

1. Cài Docker và Compose plugin, clone repository.
2. Sao chép `.env.example` ở gốc thành `.env`; thay toàn bộ mật khẩu/secret mẫu và URL. Không commit `.env`.
3. Cấu hình domain cho web/CMS và TLS tại reverse proxy hoặc load balancer.
4. Chuẩn bị schema, roles, permissions và dữ liệu Directus. `infra/directus/collections.json` chỉ là reference, chưa phải snapshot/bootstrap có thể chạy.
5. Build và chạy sau khi hoàn thành cấu hình:

```sh
docker compose -f docker-compose.prod.yml up --build -d
```

## URL và build

`NEXT_PUBLIC_SITE_URL` và `NEXT_PUBLIC_CMS_URL` được truyền vào Docker build dưới dạng build args và vào runtime. Next.js dùng chúng cho client bundle, metadata và remote images; cần rebuild khi đổi domain.

`CMS_INTERNAL_URL=http://directus:8055` dành cho giao tiếp giữa container. `NEXT_PUBLIC_CMS_URL` phải là URL CMS/assets mà trình duyệt truy cập được. Khi chạy frontend trực tiếp trên máy, dùng `apps/web/.env.local` và hostname `localhost`, không dùng hostname Docker `directus`.

Token Directus phải server-only và có quyền tối thiểu; không dùng admin token toàn quyền cho website.

## Nginx và TLS

`infra/nginx/default.conf` hiện chỉ listen HTTP port 80, chuyển `/` sang web và `/admin/` sang Directus. Compose production publish port 443 và mount thư mục cert nhưng **chưa có cấu hình HTTPS**. Cần bổ sung TLS/server blocks hoặc dùng proxy TLS bên ngoài.

Kiểm thử routing API, assets và admin của Directus. Nếu dùng subdomain riêng, thêm virtual host tương ứng; cấu hình subpath `/admin/` hiện tại chưa được xác minh đầy đủ.

## Xác minh trước sử dụng

- `pnpm check`, Docker build và khởi động từ môi trường sạch.
- CMS thực: publish/draft, danh sách, media/PDF, permissions và lưu liên hệ. Giao diện seed fallback không chứng minh tích hợp CMS thành công.
- Directus Flow gọi `/api/revalidate` với secret, cập nhật đúng danh sách lẫn chi tiết.
- `/customize` và `/customize/preview` trả 404 trên production.
- HTTPS, giám sát lỗi, sao lưu/restore PostgreSQL và uploads được kiểm thử.

## Cập nhật và rollback

Pull commit mới và chạy lại lệnh Compose build ở trên. Giữ commit/image trước để rollback; ghi nhận tag image trong quy trình vận hành.

Sao lưu trước migration. Rollback code không tự khôi phục schema/dữ liệu. Không dùng `docker compose down -v` để cập nhật vì lệnh đó xóa volumes.
