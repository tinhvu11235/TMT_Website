# Backup And Restore

Các lệnh dưới dùng Bash trên server Linux, chạy ở gốc repository với Compose production. Dùng cùng file và project name như lúc triển khai.

## PostgreSQL

Lấy biến database từ bên trong container, không giả định shell đã export `.env`:

```bash
mkdir -p backups
docker compose -f docker-compose.prod.yml exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' > backups/database.sql
```

Kiểm tra exit code và file backup, lưu bản sao ngoài server. `backups/` được Git bỏ qua vì có thể chứa dữ liệu khách hàng.

Restore vào database đích đã chuẩn bị, sau khi sao lưu trạng thái hiện tại và dừng các luồng ghi:

```bash
docker compose -f docker-compose.prod.yml exec -T postgres sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" "$POSTGRES_DB"' < backups/database.sql
```

Đây là SQL dump thông thường; dùng database trống hoặc chuẩn bị riêng kế hoạch xử lý dữ liệu hiện có.

## Uploads

Tên volume phụ thuộc Compose project. Xác định đúng volume đang mount vào `/directus/uploads`, không hardcode tiền tố:

```bash
directus_id=$(docker compose -f docker-compose.prod.yml ps -q directus)
uploads_volume=$(docker inspect "$directus_id" --format '{{range .Mounts}}{{if eq .Destination "/directus/uploads"}}{{.Name}}{{end}}{{end}}')
test -n "$uploads_volume" || exit 1
docker run --rm -v "$uploads_volume:/data:ro" -v "$PWD/backups:/backup" alpine tar czf /backup/uploads.tar.gz -C /data .
```

Sao lưu database và uploads cùng thời điểm bảo trì để giữ nhất quán metadata/file. Lưu tên volume cùng bản backup.

Restore: xác minh volume đích, sao lưu hiện trạng rồi dừng Directus. Ví dụ sau dùng lại biến `uploads_volume` đã kiểm tra ở trên và ghi đè file trùng tên:

```bash
docker compose -f docker-compose.prod.yml stop directus
docker run --rm -v "$uploads_volume:/data" -v "$PWD/backups:/backup:ro" alpine tar xzf /backup/uploads.tar.gz -C /data
docker compose -f docker-compose.prod.yml start directus
```

Giải nén không tự xóa file dư; muốn bản sao chính xác thì restore vào volume trống đã chuẩn bị. Kiểm tra quyền sở hữu, media, PDF và dữ liệu sau khi restore. Thử quy trình ở môi trường thử nghiệm trước khi dùng với production.
