from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.database.connection import Base, engine
from app.models.ticket import Ticket, Note
from app.routes.ticket_routes import router

app = FastAPI()
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

app.include_router(router)

Base.metadata.create_all(bind=engine)

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.get("/ticket/{ticket_id}", response_class=HTMLResponse)
def ticket_page(request: Request, ticket_id: str):
    return templates.TemplateResponse(request=request, name="ticket.html")