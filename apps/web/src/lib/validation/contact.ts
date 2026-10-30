import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().trim().min(8, "Số điện thoại chưa hợp lệ"),
  email: z.email("Email chưa hợp lệ").optional().or(z.literal("")),
  company: z.string().trim().optional(),
  service: z.string().trim().optional(),
  message: z.string().trim().min(10, "Nội dung cần ít nhất 10 ký tự"),
  privacy: z.literal(true, {
    error: "Vui lòng đồng ý chính sách bảo mật"
  }),
  website: z.string().max(0).optional()
});

export type ContactFormValues = z.infer<typeof contactSchema>;
