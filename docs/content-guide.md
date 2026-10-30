# Hướng dẫn chuẩn bị nội dung

## Chọn đúng nơi chỉnh sửa

Thông tin công ty, logo, màu sắc, hotline, email, mạng xã hội, menu, SEO trang tĩnh và bố cục trang chủ nằm trong `apps/web/config/site.config.json`. Chỉnh bằng editor `/customize` ở development hoặc sửa JSON hợp lệ, sau đó review, commit và build/deploy lại. Editor chỉ xuất file; việc bấm export không tự cập nhật website đang chạy.

Dịch vụ, dự án, tin tức, thống kê, chứng chỉ, thiết bị, nhân sự, đối tác, thư viện, văn phòng và hồ sơ năng lực là collection records trong Directus. Hướng dẫn thao tác nằm ở `admin-guide.md`; hợp đồng dữ liệu và những phần chưa triển khai nằm ở `cms-schema.md`.

## Hình ảnh

Ưu tiên ảnh công trình thật khi có quyền sử dụng. Kích thước gợi ý:

- Hero: 2400 × 1350.
- Ảnh dự án: 1600 × 1000.
- Ảnh dịch vụ và tin tức: 1200 × 750.
- Gallery: chiều rộng ít nhất 1600 px.

Luôn nhập alt text mô tả nội dung ảnh. Không dùng tên file làm mô tả khi có thể viết rõ hơn.

Ảnh trong SiteConfig hiện chấp nhận đường dẫn nội bộ bắt đầu bằng `/` hoặc HTTPS từ `picsum.photos`. Đặt ảnh thương hiệu thật trong `apps/web/public/`, rồi dùng đường dẫn như `/images/logo.png`. Muốn dùng CDN khác cần cập nhật cả schema và cấu hình ảnh Next.js, sau đó kiểm thử. Ảnh collection từ Directus được xử lý qua lớp provider riêng.

## Tiêu đề và slug

Dùng tiêu đề tiếng Việt rõ nghĩa. Slug nên viết thường, không dấu và phân tách bằng dấu gạch ngang, ví dụ `tu-van-giam-sat`. Giữ slug ổn định sau khi xuất bản; nếu thay đổi, cần kế hoạch chuyển hướng URL cũ.

## SEO

Viết mô tả ngắn giải thích giá trị của trang, gợi ý khoảng 140–160 ký tự. Tránh nhồi từ khóa. SEO trang tĩnh chỉnh trong SiteConfig; SEO bản ghi dịch vụ, dự án, tin tức chỉnh trong Directus sau khi schema đã được thiết lập.

## Dự án

Chuẩn bị tên, slug, ảnh cover, gallery, lĩnh vực, địa điểm, chủ đầu tư, năm, quy mô, vai trò công ty, mô tả ngắn và nội dung chi tiết. Tách tiến độ (`planning`, `in_progress`, `completed`) khỏi trạng thái xuất bản (`draft`, `published`, `archived`); không nhập trạng thái xuất bản vào trường tiến độ.

## Hồ sơ năng lực và dữ liệu mẫu

Frontend hiện cần `company_profiles.pdf_url` là URL/đường dẫn chuỗi tới PDF. Upload file lên Directus chưa tự bảo đảm nút tải dùng đúng URL; cần kiểm tra thực tế sau khi nhập dữ liệu. Không bàn giao `profile-demo.pdf`, số điện thoại mẫu hoặc ảnh placeholder như nội dung doanh nghiệp chính thức.

Khi CMS không truy cập được, website có thể hiển thị dữ liệu demo. Vì vậy, thấy nội dung ngoài website chưa đủ để xác nhận dữ liệu đã được lưu và đọc thành công từ CMS.
