import io
import datetime
from minio import Minio
from app.core.config import settings

class ReportService:
    def __init__(self):
        self.minio_client = None
        if settings.MINIO_ENDPOINT:
            try:
                self.minio_client = Minio(
                    settings.MINIO_ENDPOINT,
                    access_key=settings.MINIO_ACCESS_KEY,
                    secret_key=settings.MINIO_SECRET_KEY,
                    secure=settings.MINIO_SECURE
                )
                self.bucket_name = settings.MINIO_BUCKET_NAME
                if not self.minio_client.bucket_exists(self.bucket_name):
                    self.minio_client.make_bucket(self.bucket_name)
                print(f"✅ MinIO configured on {settings.MINIO_ENDPOINT}")
            except Exception as e:
                print(f"⚠️ MinIO initialization failed: {e}")

    async def upload_pdf(self, file_name: str, pdf_bytes: bytes) -> str:
        if not self.minio_client:
            print("⚠️ MinIO client not available. Skipping upload.")
            return f"/api/v1/documents/download?file={file_name}"
            
        try:
            # Upload to MinIO
            self.minio_client.put_object(
                self.bucket_name,
                file_name,
                io.BytesIO(pdf_bytes),
                len(pdf_bytes),
                content_type="application/pdf"
            )
            print(f"✅ Uploaded {file_name} to MinIO bucket {self.bucket_name}")
            # Generate a presigned URL or just return a path. 
            # In a real app we might return a presigned URL for direct download
            url = self.minio_client.get_presigned_url(
                "GET",
                self.bucket_name,
                file_name,
                expires=datetime.timedelta(hours=2)
            )
            return url
        except Exception as e:
            print(f"⚠️ Failed to upload {file_name} to MinIO: {e}")
            return f"/api/v1/documents/download?file={file_name}"

report_service = ReportService()
