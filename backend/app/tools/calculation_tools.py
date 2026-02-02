class CalculationTools:
    async def calculate_co_attainment(self, course_id: str, academic_year: str, semester: int) -> Dict:
        return {
            "course_id": course_id,
            "co_attainment": {
                "CO1": 2.5,
                "CO2": 2.8,
                "CO3": 2.2
            },
            "level": "MEDIUM"
        }

class DocumentTools:
    async def generate_attendance_shortage_letter(self, student_data: Dict, course_data: Dict) -> str:
        return f"http://minio:9000/docs/letters/shortage_{student_data['id']}_{course_data['id']}.pdf"
