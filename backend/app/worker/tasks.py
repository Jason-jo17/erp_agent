from app.core.celery_app import celery_app
from app.services.report_service import report_service
from app.services.llm_service import LLMService

@celery_app.task(name="app.worker.tasks.generate_report_task")
def generate_report_task(template: str, context: str):
    # This is a placeholder background task for generating reports
    print(f"Generating report {template} in background...")
    return f"Report {template} generated."
