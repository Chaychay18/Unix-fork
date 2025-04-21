# Unix-Inspired Task Management Service

A FastAPI-based task management service inspired by Unix process operations, implementing task listing (ls-like) and creation (fork-like) with SQLite persistence.

## Features
- RESTful API with endpoints for task management
- Persistent storage using SQLite
- Unix-inspired operations: list tasks (ls) and create tasks (fork)
- Input validation and error handling
- Unit tests for API endpoints
- Clear documentation and example usage

## Setup
1. Clone the repository
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `bash run.sh`

## API Endpoints

### List Tasks (GET /tasks)
Lists all tasks in the system, similar to Unix `ls`.
```bash
curl http://localhost:8000/tasks  for localhost


