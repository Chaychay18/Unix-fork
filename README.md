# Unix-Inspired Task Manager Documentation

## Overview
The **Unix-Inspired Task Manager** is a web-based application built with FastAPI (Python) that mimics Unix-like commands (`ls`, `fork`, `delete`) to manage tasks.
It features a user interface (UI) for interacting with tasks and a RESTful API for programmatic access. 
The project uses a SQLite database via SQLAlchemy for task persistence and includes a static HTML frontend with JavaScript for dynamic behavior.

## Project Structure
```
task_manager/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app and API endpoints
│   ├── models.py         # SQLAlchemy models
│   ├── database.py       # Database configuration
│   ├── schemas.py        # Pydantic schemas
│   └── tests/
│       ├── __init__.py
│       └── test_api.py   # Test cases (partially implemented)
├── static/
│   ├── index.html        # UI frontend
│   ├── style.css         # CSS styling
│   └── script.js         # JavaScript logic
├── README.md
├── requirements.txt      # Dependencies
└── run.sh                # Run script (optional)
```

## Dependencies
- `fastapi==0.95.0`
- `uvicorn==0.21.1`
- `sqlalchemy==2.0.7`
- `pydantic==1.10.13`
- `pytest==7.2.2`
- `starlette==0.26.1`

## How It Works in the UI
The UI is a single-page application accessible at the root URL (e.g., `https://unix-chaithanya.replit.app/`). It provides an interactive way to manage tasks using Unix-inspired commands.

### UI Components
- **Command Input**: A text field where users enter commands (e.g., `ls`, `fork`, `delete <id>`).
- **Submit Button**: Triggers the command execution.
- **Fork Fields**: Hidden input fields for task name and description, revealed when typing `fork`.
- **Create Task Button**: Submits a new task when using the `fork` command.
- **Result Area**: Displays JSON output of API responses (e.g., task lists, creation results).

### Command Operations
1. **List Tasks (`ls`)**
   - **Action**: Displays all tasks or a specific task by ID if provided (e.g., `ls 123e4567-e89b-12d3-a456-426614174000`).
   - **Output**: JSON array of tasks (e.g., `[{"id": "...", "name": "...", ...}]`).
   - **Example**: Typing `ls` shows all tasks.

2. **Create Task (`fork`)**
   - **Action**: Reveals input fields for task name and description. Submitting creates a new task.
   - **Output**: JSON object of the created task.
   - **Example**: Type `fork`, enter "Task 1" and "First task", click "Create Task".

3. **Delete Task (`delete <id>`)**
   - **Action**: Deletes a task by its unique ID.
   - **Output**: JSON message ("Task deleted successfully" or error).
   - **Example**: Type `delete 9f8efbfe-cf81-4fe6-8728-0829a23fe490`.

### UI and API Relationship
The UI calls the following API endpoints implemented in `app/main.py`:
- `GET /tasks`: Lists all tasks.
- `POST /tasks`: Creates a new task.
- `GET /tasks/{task_id}`: Retrieves a specific task.
- `DELETE /tasks/{task_id}`: Deletes a task.
The JavaScript (`script.js`) uses `fetch` to invoke these endpoints, and the responses are displayed as JSON in the `jsonResult` div.

## Direct API Usage
You can interact with the API directly using a browser, Postman, or `curl`. Below are examples for all operations.

### API Endpoints
- **Base URL**: `https://unix-chaithanya.replit.app/`
- **Endpoints**:
  - `GET /tasks`
  - `POST /tasks`
  - `GET /tasks/{task_id}`
  - `DELETE /tasks/{task_id}`

### Examples

#### 1. List All Tasks
- **curl**:
  ```bash
  curl https://unix-chaithanya.replit.app/tasks
  ```
  - **Response**:
    ```json
    [
        {
            "id": "9f8efbfe-cf81-4fe6-8728-0829a23fe490",
            "name": "taskk",
            "description": "job",
            "status": "running",
            "created_at": "2025-04-21T06:01:04.466909"
        },
        {
            "id": "5d2975a3-e69b-427f-81b3-99dfecf3fbcf",
            "name": "job",
            "description": "job 2",
            "status": "running",
            "created_at": "2025-04-21T09:37:31.563465"
        }
    ]
    ```



- **Browser**: Navigate to `https://unix-chaithanya.replit.app/tasks` to see the raw JSON.

#### 2. Create a Task
- **curl**:
  ```bash
  curl -X POST https://unix-chaithanya.replit.app/tasks -H "Content-Type: application/json" -d '{"name": "New Task", "description": "New Description"}'
  ```
  - **Response**:
    ```json
    {
        "id": "a1b2c3d4-e89b-12d3-a456-426614174000",
        "name": "New Task",
        "description": "New Description",
        "status": "running",
        "created_at": "2025-04-21T10:00:00.000000"
    }
    ```



#### 3. Get Task by ID
- **curl**:
  ```bash
  curl https://unix-chaithanya.replit.app/tasks/9f8efbfe-cf81-4fe6-8728-0829a23fe490
  ```
  - **Response** (if found):
    ```json
    {
        "id": "9f8efbfe-cf81-4fe6-8728-0829a23fe490",
        "name": "taskk",
        "description": "job",
        "status": "running",
        "created_at": "2025-04-21T06:01:04.466909"
    }
    ```
  - **Response** (if not found): `{"detail": "Task not found"}` with status 404.



#### 4. Delete Task by ID
- **curl**:
  ```bash
  curl -X DELETE https://unix-chaithanya.replit.app/tasks/9f8efbfe-cf81-4fe6-8728-0829a23fe490
  ```
  - **Response**: Status 204 (no content) if successful, or 404 if not found.



## Deployment
- **Local**: Run with `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` after setting up a virtual environment and installing dependencies.
- **Replit**: Upload files, install dependencies with `pip install -r requirements.txt`, and deploy with the run command `uvicorn app.main:app --host 0.0.0.0 --port $REPL_PORT`. Access via: `https://unix-chaithanya.replit.app/`


## Test Cases
Test cases are defined in `app/tests/test_api.py`, Below are the intended tests:

### Test Suite
1. **Test List Tasks**
   - **Action**: Call `GET /tasks`.
   - **Expected**: Returns an empty array `[]` or a list of tasks.
   - **Status**: Partial (manual testing via UI/curl works).

2. **Test Create Task**
   - **Action**: Call `POST /tasks` with `{"name": "Test", "description": "Test Desc"}`.
   - **Expected**: Returns a task object with a new ID and status "running".
   - **Status**: Works via UI/curl.

3. **Test Get Task by ID**
   - **Action**: Call `GET /tasks/{valid_id}`.
   - **Expected**: Returns the task object or 404 if not found.
   - **Status**: Manual testing successful.

4. **Test Delete Task**
   - **Action**: Call `DELETE /tasks/{valid_id}`.
   - **Expected**: Returns 204 if successful, 404 if not found.
   - **Status**: Manual testing successful via curl/UI.



