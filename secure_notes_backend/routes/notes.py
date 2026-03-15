from models.notes import Note
from models.user import User
from schemas.note import NoteCreate,NoteOut
from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.orm import Session

from database import get_db
from core.dependencies import get_current_user
router=APIRouter(prefix="/notes", tags=["Notes"])


@router.post("/notes/", response_model=NoteOut)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_note = Note(
        title=note.title,
        content=note.content,
        owner_id=current_user.id
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note
@router.get("/", response_model=list[NoteOut])
def get_notes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    notes = db.query(Note).filter(Note.owner_id == current_user.id).all()

    return notes

from schemas.note import NoteUpdate

@router.put("/{note_id}",response_model=NoteOut)
def update_note(
    note_id:int,
    note:NoteUpdate,
    db:Session=Depends(get_db),
    current_user :User = Depends(get_current_user)):
    db_note=db.query(Note).filter(Note.id==note_id).first()

    if not db_note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )
    if db_note.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized"
        )
    db_note.title=note.title
    db_note.content=note.content

    
    db.commit()
    db.refresh(db_note)

    return db_note
    
@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):

    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    db.delete(note)
    db.commit()

    return {"message": "Note deleted"}

