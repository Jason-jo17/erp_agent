from typing import Dict

class DocumentTools:
    async def generate_attendance_shortage_letter(self, student_data: Dict, course_data: Dict) -> str:
        # Mock document generation
        return f"http://minio:9000/docs/letters/shortage_{student_data.get('id')}_{course_data.get('id')}.pdf"
