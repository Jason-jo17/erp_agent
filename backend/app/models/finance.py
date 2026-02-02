import uuid
from sqlalchemy import Column, String, Boolean, ForeignKey, Integer, Date, Text, DECIMAL, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from .base import TimeStampedBase

class BudgetHead(TimeStampedBase):
    __tablename__ = "budget_heads"

    budget_head_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    budget_code = Column(String(50), unique=True, nullable=False)
    budget_name = Column(String(200), nullable=False)
    parent_head_id = Column(UUID(as_uuid=True), ForeignKey('budget_heads.budget_head_id'), nullable=True)
    head_type = Column(String(50)) # REVENUE, EXPENDITURE
    category = Column(String(100))

    parent = relationship("BudgetHead", remote_side=[budget_head_id])


class FeeStructure(TimeStampedBase):
    __tablename__ = "fee_structure"

    fee_structure_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    program_id = Column(UUID(as_uuid=True), ForeignKey('programs.program_id'))
    academic_year = Column(String(10))
    semester = Column(Integer)
    fee_component = Column(String(100))
    amount = Column(DECIMAL(10,2))
    is_refundable = Column(Boolean, default=False)
    due_date = Column(Date)


class StudentFee(TimeStampedBase):
    __tablename__ = "student_fees"

    student_fee_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey('users.user_id'))
    academic_year = Column(String(10))
    semester = Column(Integer)
    fee_structure_id = Column(UUID(as_uuid=True), ForeignKey('fee_structure.fee_structure_id'))
    amount_due = Column(DECIMAL(10,2))
    amount_paid = Column(DECIMAL(10,2), default=0)
    balance = Column(DECIMAL(10,2))
    payment_status = Column(String(50)) # PAID, PARTIAL, UNPAID


class Vendor(TimeStampedBase):
    __tablename__ = "vendors"

    vendor_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    vendor_code = Column(String(50), unique=True)
    vendor_name = Column(String(300), nullable=False)
    gstin = Column(String(15))
    contact_person = Column(String(200))
    mobile = Column(String(15))
    email = Column(String(255))
    vendor_type = Column(String(100))
    is_approved = Column(Boolean, default=False)


class PurchaseOrder(TimeStampedBase):
    __tablename__ = "purchase_orders"

    po_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    po_number = Column(String(50), unique=True, nullable=False)
    vendor_id = Column(UUID(as_uuid=True), ForeignKey('vendors.vendor_id'))
    po_date = Column(Date, nullable=False)
    total_amount = Column(DECIMAL(15,2))
    po_status = Column(String(50))
