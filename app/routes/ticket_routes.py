from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from app.database.dependencies import get_db
from app.models.ticket import Ticket, Note

router = APIRouter()


# --- Pydantic Schemas ---
class CreateTicketBody(BaseModel):
    customer_name: str
    customer_email: str
    subject: str
    description: str

class UpdateTicketBody(BaseModel):
    status: str
    notes: Optional[str] = None


# ✅ CREATE TICKET
@router.post("/api/tickets")
def create_ticket(body: CreateTicketBody, db: Session = Depends(get_db)):
    # Count existing tickets to generate TKT-001 format
    count = db.query(Ticket).count()
    ticket_id = f"TKT-{str(count + 1).zfill(3)}"

    ticket = Ticket(
        ticket_id=ticket_id,
        customer_name=body.customer_name,
        customer_email=body.customer_email,
        subject=body.subject,
        description=body.description,
        status="Open"
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return {
        "ticket_id": ticket.ticket_id,
        "created_at": ticket.created_at
    }


# ✅ GET ALL TICKETS (with search + filter)
@router.get("/api/tickets")
def get_tickets(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Ticket)

    if status:
        query = query.filter(Ticket.status == status)

    if search:
        like = f"%{search}%"
        query = query.filter(
            Ticket.customer_name.ilike(like) |
            Ticket.customer_email.ilike(like) |
            Ticket.ticket_id.ilike(like) |
            Ticket.subject.ilike(like)
        )

    tickets = query.order_by(Ticket.created_at.desc()).all()

    return [
        {
            "ticket_id": t.ticket_id,
            "customer_name": t.customer_name,
            "customer_email": t.customer_email,
            "subject": t.subject,
            "status": t.status,
            "created_at": t.created_at
        }
        for t in tickets
    ]


# ✅ GET TICKET BY ticket_id
@router.get("/api/tickets/{ticket_id}")
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    notes = [
        {"note_text": n.note_text, "created_at": n.created_at}
        for n in ticket.notes
    ]

    return {
        "ticket_id": ticket.ticket_id,
        "customer_name": ticket.customer_name,
        "customer_email": ticket.customer_email,
        "subject": ticket.subject,
        "description": ticket.description,
        "status": ticket.status,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "notes": notes
    }


# ✅ UPDATE TICKET
@router.put("/api/tickets/{ticket_id}")
def update_ticket(ticket_id: str, body: UpdateTicketBody, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    ticket.status = body.status

    if body.notes:
        note = Note(ticket_id=ticket_id, note_text=body.notes)
        db.add(note)

    db.commit()
    db.refresh(ticket)

    return {"success": True, "updated_at": ticket.updated_at}


# ✅ DELETE TICKET
@router.delete("/api/tickets/{ticket_id}")
def delete_ticket(ticket_id: str, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db.delete(ticket)
    db.commit()

    return {"message": "Ticket deleted successfully"}
