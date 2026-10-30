import type {
  Article,
  Certificate,
  CompanyProfile,
  Equipment,
  GalleryItem,
  CompanyLocation,
  Partner,
  Project,
  Service,
  Statistic,
  TeamMember
} from "@/types/content";

const img = (seed: string, alt: string) => ({
  src: `https://picsum.photos/seed/${seed}/1200/800`,
  alt,
  width: 1200,
  height: 800
});

const demoCompanyShortName = "ABC Engineering";

export const demoLocations: CompanyLocation[] = [
  {
    id: "head-office",
    name: "Trụ sở chính",
    address: "Tầng 8, Tòa nhà ABC, Quận 1, TP. Hồ Chí Minh",
    phone: "028 0000 0000",
    email: "contact@example.com",
    mapUrl: "https://maps.google.com",
    mapEmbed: "",
    isHeadOffice: true,
    order: 1,
    enabled: true
  },
  {
    id: "can-tho-office",
    name: "Chi nhánh Cần Thơ",
    address: "Quận Ninh Kiều, TP. Cần Thơ",
    phone: "0292 000 0000",
    email: "cantho@example.com",
    mapUrl: "https://maps.google.com",
    isHeadOffice: false,
    order: 2,
    enabled: true
  }
];

export const demoStatistics: Statistic[] = [
  { id: "years", value: "20", suffix: "+", label: "Năm kinh nghiệm", icon: "HardHat", order: 1, enabled: true },
  { id: "projects", value: "300", suffix: "+", label: "Dự án đã tham gia", icon: "Building2", order: 2, enabled: true },
  { id: "engineers", value: "50", suffix: "+", label: "Kỹ sư và chuyên gia", icon: "Users", order: 3, enabled: true },
  { id: "fields", value: "10", suffix: "+", label: "Lĩnh vực chuyên môn", icon: "Ruler", order: 4, enabled: true }
];

export const demoServices: Service[] = [
  ["Quy hoạch", "quy-hoach", "Lập nhiệm vụ, ý tưởng và hồ sơ quy hoạch cho dự án hạ tầng, đô thị và khu chức năng."],
  ["Tư vấn thiết kế", "tu-van-thiet-ke", "Thiết kế cơ sở, kỹ thuật và bản vẽ thi công với quy trình kiểm soát chất lượng rõ ràng."],
  ["Tư vấn giám sát", "tu-van-giam-sat", "Giám sát chất lượng, tiến độ, khối lượng và an toàn trong suốt vòng đời thi công."],
  ["Khảo sát xây dựng", "khao-sat-xay-dung", "Khảo sát địa hình, địa chất, hiện trạng và điều kiện kỹ thuật phục vụ thiết kế."],
  ["Thí nghiệm vật liệu", "thi-nghiem-vat-lieu", "Thí nghiệm hiện trường và phòng lab cho vật liệu, cấu kiện và nền móng công trình."],
  ["Quản lý dự án", "quan-ly-du-an", "Lập kế hoạch, điều phối nguồn lực, quản trị rủi ro và báo cáo tiến độ dự án."]
].map(([title, slug, shortDescription], index) => ({
  id: slug,
  title,
  slug,
  shortDescription,
  content:
    "Dịch vụ được triển khai theo quy trình chuẩn, có kiểm soát hồ sơ, nhân sự phụ trách và hệ thống báo cáo minh bạch cho chủ đầu tư.",
  featuredImage: img(`service-${slug}`, title),
  icon: "HardHat",
  category: "Tư vấn xây dựng",
  order: index + 1,
  enabled: true,
  featured: index < 4,
  status: "published",
  seoTitle: `${title} | ${demoCompanyShortName}`,
  seoDescription: shortDescription,
  sections: {
    overview: shortDescription,
    scope: ["Khảo sát nhu cầu và phạm vi", "Lập kế hoạch triển khai", "Kiểm soát hồ sơ và nghiệm thu", "Báo cáo định kỳ cho chủ đầu tư"],
    process: ["Tiếp nhận thông tin", "Đề xuất phương án", "Triển khai chuyên môn", "Bàn giao và hỗ trợ sau bàn giao"],
    capability: "Đội ngũ kỹ sư nhiều kinh nghiệm, am hiểu tiêu chuẩn Việt Nam và quy chuẩn chuyên ngành.",
    equipment: ["Thiết bị đo đạc", "Phần mềm thiết kế", "Biểu mẫu kiểm soát chất lượng"]
  }
}));

export const demoProjects: Project[] = Array.from({ length: 8 }, (_, index) => {
  const service = demoServices[index % demoServices.length];
  const year = 2026 - (index % 5);
  const slug = [
    "trung-tam-hanh-chinh-minh-long",
    "nha-may-co-khi-phu-my",
    "cau-vuot-khu-cong-nghiep-bac-son",
    "khu-do-thi-song-xanh",
    "truong-lien-cap-an-phu",
    "benh-vien-da-khoa-mien-dong",
    "tuyen-duong-ven-song",
    "trung-tam-logistics-tan-cang"
  ][index];
  const name = [
    "Trung tâm hành chính Minh Long",
    "Nhà máy cơ khí Phú Mỹ",
    "Cầu vượt KCN Bắc Sơn",
    "Khu đô thị Sông Xanh",
    "Trường liên cấp An Phú",
    "Bệnh viện đa khoa Miền Đông",
    "Tuyến đường ven sông",
    "Trung tâm logistics Tân Cảng"
  ][index];
  return {
    id: slug,
    name,
    slug,
    shortDescription: "Dự án tiêu biểu với phạm vi tư vấn kỹ thuật, kiểm soát chất lượng và điều phối tiến độ.",
    content:
      "Dự án được triển khai theo mô hình phối hợp đa bộ môn, tập trung vào tính khả thi kỹ thuật, kiểm soát rủi ro và hiệu quả vận hành sau bàn giao.",
    featuredImage: img(`project-${slug}`, name),
    gallery: [img(`project-${slug}-1`, name), img(`project-${slug}-2`, name)],
    category: index % 2 === 0 ? "Hạ tầng" : "Dân dụng và công nghiệp",
    services: [service],
    location: index % 2 === 0 ? "TP. Hồ Chí Minh" : "Bình Dương",
    investor: "Chủ đầu tư demo",
    startYear: year - 1,
    completionYear: year,
    projectScale: "Quy mô trung bình đến lớn",
    companyRole: service.title,
    status: index % 3 === 0 ? "in_progress" : "completed",
    publishStatus: "published",
    enabled: true,
    featured: index < 4,
    order: index + 1,
    seoTitle: `${name} | Dự án tiêu biểu`,
    seoDescription: "Thông tin dự án, phạm vi công việc, giải pháp và kết quả triển khai.",
    sections: {
      introduction: "Công trình yêu cầu phối hợp kỹ thuật giữa nhiều bộ môn và các bên liên quan.",
      scope: "Tư vấn, kiểm tra hồ sơ, giám sát kỹ thuật và báo cáo tiến độ.",
      challenge: "Điều kiện mặt bằng, tiến độ và yêu cầu chất lượng cần được kiểm soát chặt.",
      solution: "Thiết lập kế hoạch kiểm soát, phân quyền trách nhiệm và báo cáo theo mốc.",
      result: "Dự án đạt yêu cầu kỹ thuật, tiến độ và hồ sơ nghiệm thu."
    }
  };
});

export const demoArticles: Article[] = Array.from({ length: 6 }, (_, index) => {
  const slug = [
    "cap-nhat-tieu-chuan-giam-sat-cong-trinh",
    "khoi-cong-du-an-ha-tang-moi",
    "dao-tao-an-toan-lao-dong-dinh-ky",
    "ung-dung-bim-trong-quan-ly-du-an",
    "kiem-soat-chat-luong-vat-lieu-dau-vao",
    "abc-engineering-mo-rong-doi-ngu-khao-sat"
  ][index];
  const title = [
    "Cập nhật tiêu chuẩn giám sát công trình",
    "Khởi công dự án hạ tầng mới",
    "Đào tạo an toàn lao động định kỳ",
    "Ứng dụng BIM trong quản lý dự án",
    "Kiểm soát chất lượng vật liệu đầu vào",
    "ABC Engineering mở rộng đội ngũ khảo sát"
  ][index];
  return {
    id: slug,
    title,
    slug,
    category: index % 2 === 0 ? "Tin ngành" : "Hoạt động công ty",
    excerpt: "Bản tin demo giúp kiểm tra giao diện, SEO và luồng quản trị nội dung.",
    content:
      "Nội dung bài viết được quản trị trong CMS. Biên tập viên có thể cập nhật tiêu đề, ảnh đại diện, nội dung, mô tả SEO và trạng thái xuất bản mà không cần chỉnh sửa source code.",
    thumbnail: img(`article-${slug}`, title),
    gallery: [],
    author: "Ban truyền thông",
    publishedAt: new Date(2026, index, 12).toISOString(),
    featured: index < 3,
    status: "published",
    seoTitle: title,
    seoDescription: "Bài viết demo cho website doanh nghiệp xây dựng."
  };
});

export const demoTeam: TeamMember[] = ["Nguyễn Minh An", "Trần Quốc Bảo", "Lê Hoàng Chi", "Phạm Tuấn Dũng"].map((name, index) => ({
  id: `team-${index + 1}`,
  name,
  position: ["Giám đốc kỹ thuật", "Trưởng phòng thiết kế", "Chỉ huy trưởng", "Kỹ sư khảo sát"][index],
  department: "Khối kỹ thuật",
  avatar: img(`team-${index + 1}`, name),
  qualification: "Kỹ sư xây dựng",
  experience: `${10 + index * 2}+ năm kinh nghiệm`,
  bio: "Phụ trách điều phối chuyên môn, kiểm soát chất lượng và hỗ trợ chủ đầu tư trong các giai đoạn dự án.",
  order: index + 1,
  enabled: true,
  showOnWebsite: true
}));

export const demoCertificates: Certificate[] = Array.from({ length: 8 }, (_, index) => ({
  id: `certificate-${index + 1}`,
  name: `Chứng chỉ năng lực hoạt động xây dựng hạng ${index < 4 ? "I" : "II"}`,
  image: img(`certificate-${index + 1}`, "Chứng chỉ năng lực"),
  organization: "Cơ quan cấp phép demo",
  certificateNumber: `ABC-${2020 + index}-CN`,
  issuedDate: new Date(2020 + index, 1, 1).toISOString(),
  description: "Chứng chỉ demo phục vụ kiểm tra giao diện và cấu trúc CMS.",
  order: index + 1,
  enabled: true,
  featured: index < 4,
  status: "published"
}));

export const demoEquipment: Equipment[] = ["Máy toàn đạc", "Máy GPS RTK", "Thiết bị thí nghiệm nén", "Máy siêu âm bê tông", "Thiết bị đo độ chặt"].map((name, index) => ({
  id: `equipment-${index + 1}`,
  name,
  slug: `thiet-bi-${index + 1}`,
  category: index < 2 ? "Khảo sát" : "Thí nghiệm",
  brand: "DemoTech",
  model: `DT-${100 + index}`,
  quantity: 1 + index,
  image: img(`equipment-${index + 1}`, name),
  description: "Thiết bị phục vụ khảo sát, kiểm tra và nghiệm thu hiện trường.",
  specification: "Thông số kỹ thuật được quản trị trong CMS.",
  order: index + 1,
  enabled: true
}));

export const demoPartners: Partner[] = Array.from({ length: 8 }, (_, index) => ({
  id: `partner-${index + 1}`,
  name: `Đối tác ${index + 1}`,
  logo: null,
  website: "https://example.com",
  category: index % 2 === 0 ? "Chủ đầu tư" : "Nhà cung cấp",
  featured: true,
  order: index + 1,
  enabled: true
}));

export const demoGallery: GalleryItem[] = Array.from({ length: 10 }, (_, index) => ({
  id: `gallery-${index + 1}`,
  title: `Hình ảnh công trình ${index + 1}`,
  type: "image",
  category: ["Công trình", "Hoạt động", "Nhân sự", "Chứng chỉ", "Sự kiện"][index % 5],
  image: img(`gallery-${index + 1}`, `Thư viện ${index + 1}`),
  order: index + 1,
  enabled: true
}));

export const demoCompanyProfile: CompanyProfile = {
  id: "profile-2026",
  title: "Hồ sơ năng lực ABC Engineering",
  pdfUrl: "/profile-demo.pdf",
  thumbnail: img("profile-thumbnail", "Hồ sơ năng lực"),
  version: "2026.01",
  uploadedAt: new Date(2026, 0, 5).toISOString()
};
