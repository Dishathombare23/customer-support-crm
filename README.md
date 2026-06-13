# Customer Support CRM

A full-stack web application for managing customer support tickets.

## Tech Stack
- **Backend:** FastAPI (Python)
- **Database:** SQLite + SQLAlchemy
- **Frontend:** HTML, CSS, JavaScript

## Features
- Create support tickets with customer info
- List all tickets with status badges
- Search by name, email, or ticket ID
- Filter by status (Open, In Progress, Closed)
- View and update ticket details
- Add notes to tickets

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Dishathombare23/customer-support-crm.git
cd customer-support-crm
```

### 2. Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the app
```bash
uvicorn app.main:app --reload
```

### 5. Open browser
http://127.0.0.1:8000


## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tickets | Create ticket |
| GET | /api/tickets | List all tickets |
| GET | /api/tickets/{ticket_id} | Get ticket detail |
| PUT | /api/tickets/{ticket_id} | Update ticket |
| DELETE | /api/tickets/{ticket_id} | Delete ticket |