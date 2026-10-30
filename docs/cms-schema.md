# Hợp đồng dữ liệu CMS

## Trạng thái hiện tại

Đây là tài liệu tham chiếu cho MVP. `infra/directus/collections.json` mô tả collection và quyền cần thiết, **không phải snapshot có thể import hoặc migration đã chạy**. Repository chưa tự tạo schema, roles, permissions hay webhook khi khởi động Directus. Cần hoàn thiện bootstrap và kiểm thử bằng CMS thật trước khi bàn giao production.

Nguồn đối chiếu với code:

- `apps/web/src/types/content.ts`: kiểu dữ liệu frontend.
- `apps/web/src/lib/directus/client.ts`: request REST và đổi key từ snake_case sang camelCase.
- `apps/web/src/services/content.ts`: collection, filter, sort và fallback.
- `apps/web/src/services/providers/directus-normalize.ts`: ảnh và trạng thái dự án.

Đổi tên key không tự chuyển đổi quan hệ hoặc mọi kiểu dữ liệu. Các dạng quan hệ file/gallery/category phải được chốt cùng provider và integration tests.

## Ranh giới SiteConfig và Directus

`apps/web/config/site.config.json` quản lý thông tin công ty, thương hiệu, liên hệ, social, menu, màu sắc, SEO trang tĩnh, nội dung trang tĩnh và thứ tự/cấu hình block trang chủ. Editor `/customize` chỉ chạy khi development được bật `ENABLE_SITE_EDITOR=true`; chỉ preview/import/export JSON, không ghi repository hoặc lưu cấu hình vào CMS.

Frontend hiện không đọc các collection `global_settings`, `menus`, `menu_items`, `homepage_content`, `homepage_sections` hay `pages`. Không tạo các collection đó để thay thế SiteConfig. Route trang vẫn do code quản lý; kiểu `PageContent` chưa tạo thành chức năng trang động.

## Collection được frontend sử dụng

Tên trường dưới đây dùng snake_case phía Directus. Kiểu đầy đủ xem `content.ts`; danh sách này phục vụ thiết kế schema, chưa xác nhận một CMS đang có các field tương ứng.

| Collection | Trường chính và cách sử dụng |
| --- | --- |
| `company_locations` | `name`, `address`, `phone`, `email`, `map_url`, `map_embed`, `latitude`, `longitude`, `is_head_office`, `order`, `enabled`. Trang liên hệ lọc `enabled`. |
| `statistics` | `value`, `suffix`, `label`, `icon`, `order`, `enabled`. Dữ liệu block thống kê trang chủ. |
| `services` | `title`, `slug`, `short_description`, `content`, `featured_image`, `icon`, `category`, `order`, `enabled`, `featured`, `status`, SEO và `sections` nếu dùng. Lọc `enabled`; nếu có trạng thái xuất bản thì chỉ hiển thị `published`. |
| `projects` | `name`, `slug`, `short_description`, `content`, `featured_image`, `gallery`, `category`, `services`, `location`, `investor`, `start_year`, `completion_year`, `project_scale`, `company_role`, tiến độ, trạng thái xuất bản, `featured`, `order`, SEO và `sections`. Xem hợp đồng trạng thái bên dưới. |
| `articles` | `title`, `slug`, `category`, `excerpt`, `content`, `thumbnail`, `gallery`, `author`, `published_at`, `featured`, `status`, SEO. Request lọc `status=published`. |
| `team_members` | `name`, `position`, `department`, `avatar`, `qualification`, `experience`, `bio`, `order`, `enabled`, `show_on_website`. Cần cả hai cờ hiển thị. |
| `certificates` | `name`, `image`, `organization`, `certificate_number`, `issued_date`, `expired_date`, `description`, `order`, `enabled`, `featured`, `status`. Lọc `enabled` và `status=published`. |
| `equipment` | `name`, `slug`, `category`, `brand`, `model`, `quantity`, `image`, `description`, `specification`, `order`, `enabled`. |
| `partners` | `name`, `logo`, `website`, `category`, `featured`, `order`, `enabled`. |
| `gallery_items` | `title`, `type`, `category`, `image`, `video_url`, `order`, `enabled`. Kiểu dữ liệu có `image/video/youtube`; trang thư viện hiện mới render ảnh, chưa có player video. |
| `company_profiles` | `title`, `pdf_url`, `thumbnail`, `version`, `uploaded_at`. Lấy bản mới nhất theo `uploaded_at`. `pdf_url` hiện phải là chuỗi URL/đường dẫn, chưa tự chuyển file ID/object thành URL PDF. |
| `contact_requests` | `name`, `phone`, `email`, `company`, `service`, `message`, `ip`, `user_agent`, `status`, `created_at`. Collection riêng tư; chỉ server tạo bản ghi. |

Các collection dùng cho danh sách cần `id`; `order` dùng cho sắp xếp ở những collection tương ứng. Các trường SEO được frontend hỗ trợ gồm `seo_title`, `seo_description`, `og_image`.

## Tiến độ và xuất bản của dự án

Hợp đồng đơn giản phù hợp với model hiện tại:

- `status`: `planning`, `in_progress` hoặc `completed` để mô tả tiến độ.
- `publish_status`: `draft`, `published` hoặc `archived` để kiểm soát xuất bản.
- `enabled`: có thể dùng để tạm ẩn.

Provider cũng nhận `project_status`/`progress_status` cho tiến độ và `publication_status` cho xuất bản. Không dựa vào `status=draft/published/archived` để kiểm soát xuất bản dự án: cần mapping và test rõ ràng nếu dùng schema đó. DTO thiếu tiến độ hợp lệ bị từ chối. Trạng thái xuất bản là tùy chọn trong kiểu frontend hiện tại, vì vậy bắt buộc có filter quyền ở CMS để bảo vệ bản nháp.

## File và quan hệ

Ảnh đơn hiện được normalize từ ID file, URL/đường dẫn hoặc object có `id`/`src`. Gallery cần mảng có dạng mà `normalizeImageAssets()` hỗ trợ; quan hệ junction từ Directus chưa có mapper tổng quát. `category` trong model hiện là chuỗi. Nếu dùng collection category hoặc quan hệ many-to-many, bổ sung mapper và test từ response API thật trước khi khai báo hoàn tất.

## Quyền truy cập

Public role chỉ được đọc các field/nội dung cần công khai, có filter published/enabled tương ứng. Không cấp quyền ghi public, không cho đọc `contact_requests`, bản nháp hoặc thông tin quản trị.

`DIRECTUS_STATIC_TOKEN` chỉ dùng phía server để tạo yêu cầu liên hệ. Áp dụng quyền tối thiểu và kiểm tra quyền đọc collection khi dùng token này; client hiện dùng cùng bộ header cho các request đọc và ghi. Không đưa token vào SiteConfig hoặc biến `NEXT_PUBLIC_*`.

Nhóm menu và tên hiển thị tiếng Việt trong file reference là đề xuất cấu hình admin, chưa được bootstrap tự động.

## Cache và webhook

Request đọc Directus đặt `next.revalidate=120`. API `/api/revalidate` đã được triển khai; Directus Flow/Webhook chưa được tự tạo. Sau khi cấu hình `REVALIDATION_SECRET`, Flow có thể gọi:

```text
POST https://domain.com/api/revalidate
x-revalidation-secret: <REVALIDATION_SECRET>
```

```json
{
  "collection": "projects",
  "slug": "nha-may-abc"
}
```

Cần kiểm thử cập nhật danh sách, trang chi tiết, homepage và những trang dùng chung dữ liệu. Mapping collection/path hiện chưa bao phủ mọi nơi tiêu thụ dữ liệu; có thể gửi `path` cụ thể qua endpoint khi tích hợp. Thay đổi SiteConfig cần commit và build/deploy lại, không đi qua webhook CMS.

## Hành vi fallback và giới hạn cần kiểm thử

- Request CMS lỗi có thể dùng seed demo, kể cả production. Dữ liệu xuất hiện ngoài website không chứng minh CMS đã được thiết lập đúng.
- List collection trả thành công với `[]` giữ nguyên rỗng. `company_profiles` là ngoại lệ, hiện vẫn dùng hồ sơ demo khi rỗng.
- Phần lớn list request chưa đặt pagination/limit tường minh; cần test với dữ liệu vượt giới hạn mặc định của API.
- Không coi TypeScript type assertion là validation đầy đủ cho response CMS.

Xem `AI_HANDOFF.md` để tiếp tục triển khai và kiểm tra tiêu chí bàn giao.
