# Hướng Dẫn Quản Trị Website

Đây là hướng dẫn cho MVP, chưa phải xác nhận hệ thống đã sẵn sàng production. Trước khi dùng CMS thật, người triển khai cần tạo schema, phân quyền và kiểm thử tích hợp theo `cms-schema.md`; file `infra/directus/collections.json` chỉ là tài liệu tham chiếu, không tự tạo các màn hình quản trị.

Website có hai nguồn dữ liệu rõ ràng:

- `apps/web/config/site.config.json`: thông tin công ty, logo, liên hệ, menu, màu sắc, SEO tĩnh, nội dung trang tĩnh và bố cục trang chủ.
- Directus: dịch vụ, dự án, tin tức, thống kê, chứng chỉ, thiết bị, nhân sự, đối tác, thư viện, văn phòng, hồ sơ năng lực và yêu cầu liên hệ.

Thay đổi Directus được cập nhật qua cache/revalidation. Thay đổi SiteConfig cần export, review, commit và build/deploy lại.

## 1. Chỉnh cấu hình website trong môi trường phát triển

Đặt `ENABLE_SITE_EDITOR=true`, chạy web ở development rồi mở `/customize`. Editor không hoạt động ở production và không ghi trực tiếp vào repository.

Editor hỗ trợ:

- chỉnh Company, Branding, Contact, Social, Navigation, SEO và Theme;
- chọn, sửa, ẩn/hiện, đổi thứ tự, xóa, thêm lại hoặc đặt lại block trang chủ;
- preview mobile/tablet/desktop;
- nhập JSON hợp lệ và xuất `site.config.json` đã chuẩn hóa.

Thao tác export chỉ tải file về máy, không lưu ngược vào source, CMS hoặc website đang chạy. Bản nháp preview không thay thế file cấu hình chính thức. Để dùng logo/ảnh riêng trong SiteConfig, đặt file trong `apps/web/public/` và dùng đường dẫn nội bộ; schema hiện chỉ cho phép ảnh remote từ `picsum.photos`.

Sau khi hoàn tất, tải JSON, thay file `apps/web/config/site.config.json`, chạy `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, rồi commit/deploy. Không đưa dịch vụ, dự án hoặc collection records vào file này.

## 2. Đăng nhập CMS

Mở địa chỉ CMS thực tế do người triển khai cung cấp, nhập email và mật khẩu được cấp. `https://admin.domain.com` chỉ là địa chỉ ví dụ. Các nhóm Nội dung, Năng lực, Doanh nghiệp, Khách hàng và Media cần được người triển khai cấu hình trước.

Logo, favicon, hotline, email, địa chỉ, mạng xã hội, menu, màu thương hiệu, SEO tĩnh và banner trang chủ được chỉnh trong SiteConfig/editor, không chỉnh trong Directus.

## 3. Thêm dịch vụ

Vào **Nội dung → Dịch vụ**, bấm tạo mới. Nhập tên, slug, mô tả ngắn, nội dung, ảnh đại diện, SEO nếu có. Bật **Hiển thị ngoài website**, chọn **Published**, rồi lưu.

## 4. Thêm dự án

Vào **Nội dung → Dự án**, bấm tạo mới. Nhập tên dự án, slug, ảnh cover, gallery, lĩnh vực, dịch vụ liên quan, địa điểm, chủ đầu tư, năm, quy mô và vai trò công ty. Chọn tiến độ riêng (`planning`, `in_progress`, `completed`) và trạng thái xuất bản riêng (`publish_status=published`). Sau khi schema/provider được tích hợp đúng, dự án xuất hiện tại `/du-an` và `/du-an/slug`. Không nhập `published` vào trường tiến độ.

## 5. Upload gallery dự án

Trong bản ghi dự án, tìm trường **Gallery** đã được người triển khai cấu hình. Chọn nhiều ảnh từ Media Library hoặc upload ảnh mới, sắp xếp thứ tự nếu có hỗ trợ, sau đó lưu và kiểm tra trang chi tiết. Kiểu quan hệ gallery phải được đối chiếu với provider; việc upload thành công chưa chứng minh frontend đọc đúng toàn bộ ảnh.

## 6. Thêm chứng chỉ

Vào **Năng lực → Chứng chỉ**, bấm tạo mới. Upload ảnh chứng chỉ, nhập tên, đơn vị cấp, số chứng chỉ, ngày cấp, ngày hết hạn, mô tả, thứ tự. Bật **Hiển thị ngoài website** và chọn **Published**.

## 7. Thêm đối tác

Vào **Doanh nghiệp → Đối tác**, bấm tạo mới. Nhập tên, website, category, upload logo, bật **Featured** nếu muốn hiện ở trang chủ, rồi lưu.

## 8. Đăng tin tức

Vào **Nội dung → Tin tức**, tạo bài viết mới. Nhập title, slug, category, thumbnail, excerpt, nội dung, gallery và SEO. Để **Draft** khi đang soạn, chuyển sang **Published** khi muốn hiển thị.

## 9. Upload hồ sơ năng lực

Vào **Doanh nghiệp → Hồ sơ năng lực** sau khi collection đã được cấu hình. Frontend hiện đọc `pdf_url` dạng chuỗi URL/đường dẫn, cùng thumbnail, version và `uploaded_at`. Upload PDF rồi điền URL truy cập được vào `pdf_url`; chưa có chuyển đổi tự động từ file ID/object. Website lấy bản ghi mới nhất theo ngày cập nhật. Mở cả nút xem và tải PDF để kiểm tra, không chỉ kiểm tra file trong Media Library.

## 10. Ẩn một nội dung

Mở nội dung cần ẩn và tắt **Hiển thị ngoài website** ở collection có trường `enabled`. Dịch vụ, tin tức và chứng chỉ có trạng thái xuất bản; dự án dùng `publish_status` riêng. Chỉ dùng **Archived** ở collection đã có field và bộ lọc tương ứng. Không nên xóa nếu chỉ muốn tạm ẩn.

## 11. Publish nội dung

Khi nội dung đã sẵn sàng, đổi trạng thái xuất bản thành **Published** ở collection hỗ trợ rồi lưu. Request CMS có cache revalidation 120 giây; API `/api/revalidate` đã có nhưng Flow/Webhook Directus cần cấu hình riêng. Người triển khai phải kiểm thử cập nhật ở danh sách, trang chi tiết và homepage.

## 12. Quản lý Media Library

Vào **Hệ thống → Media**. Bạn có thể upload ảnh, upload nhiều ảnh, đổi tên, xem preview, thay file, xóa file không dùng, nhập alt text, title và caption.

## 13. SEO cơ bản

Với Dịch vụ, Dự án và Tin tức, có thể nhập **Tiêu đề SEO**, **Mô tả SEO**, **Ảnh chia sẻ mạng xã hội** và **Slug** khi schema đã có các field tương ứng. Nếu để trống, website tự tạo fallback từ tiêu đề và tên công ty. SEO trang tĩnh chỉnh trong SiteConfig. Collection `pages` hiện chưa được frontend sử dụng để sinh trang động.

## 14. Logout

Bấm avatar tài khoản ở góc giao diện Directus và chọn đăng xuất.

## Kiểm thử bàn giao

1. Import/export SiteConfig, đổi Hotline rồi kiểm tra Header, Footer, Contact Page và Floating Call.
2. Đổi logo trong SiteConfig, kiểm tra Header, Footer và favicon.
3. Thêm chứng chỉ Published + enabled, kiểm tra trang Năng lực.
4. Thêm dự án Published, kiểm tra `/du-an` và `/du-an/[slug]`.
5. Upload 10 ảnh vào Project Gallery, kiểm tra gallery render đủ ảnh.
6. Thay email, kiểm tra Contact Page và Footer.
7. Tắt `enabled` của Certificate, kiểm tra chứng chỉ biến mất ngoài website.
8. Publish Article mới, kiểm tra danh sách Tin tức.
9. Thay PDF hồ sơ năng lực, kiểm tra nút tải trỏ tới file mới.
10. Xác nhận list collection Directus rỗng hiển thị rỗng. Riêng hồ sơ năng lực hiện vẫn fallback bản demo khi rỗng; cần xử lý trước bàn giao thực tế.
11. Gửi form liên hệ và xác nhận có bản ghi trong CMS. Development có thể báo thành công dù ghi CMS lỗi; production trả 503 khi dịch vụ ghi không khả dụng. Chưa có gửi email SMTP.
12. Kiểm tra bằng tài khoản public và token server: bản nháp, yêu cầu liên hệ và thông tin quản trị không được lộ ra frontend.

Nếu xuất hiện lại dữ liệu demo khi CMS lỗi, báo người triển khai kiểm tra kết nối và quyền. Không coi dữ liệu demo là dữ liệu đã lưu trong CMS. Các mục kỹ thuật còn lại được ghi tại `AI_HANDOFF.md`.
