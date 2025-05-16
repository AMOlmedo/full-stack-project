from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, schemas, database

app = FastAPI()

@app.post("/clientes/")
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(database.get_db)):
    db_cliente = models.Cliente(**cliente.dict())
    db.add(db_cliente)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente