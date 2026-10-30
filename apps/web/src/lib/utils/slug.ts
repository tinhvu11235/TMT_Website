const vietnameseMap: Record<string, string> = {
  đ: "d",
  Đ: "D"
};

export function slugify(input: string) {
  return input
    .split("")
    .map((char) => vietnameseMap[char] ?? char)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
