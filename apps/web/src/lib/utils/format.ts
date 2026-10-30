export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(date));
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    planning: "Đang chuẩn bị",
    in_progress: "Đang triển khai",
    completed: "Hoàn thành"
  };

  return map[status] ?? status;
}
