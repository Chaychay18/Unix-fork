import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import get_db
from app.models import Task
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Setup test database
DATABASE_URL = "sqlite:///./test_tasks.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

# Apply dependency override and create TestClient
app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Task.metadata.create_all(bind=engine)
    yield
    Task.metadata.drop_all(bind=engine)

def test_create_task():
    response = client.post("/tasks", json={"name": "Test Task", "description": "Test Description"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Task"
    assert data["description"] == "Test Description"
    assert data["status"] == "running"

def test_list_tasks():
    client.post("/tasks", json={"name": "Test Task"})
    response = client.get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_task_not_found():
    response = client.get("/tasks/nonexistent_id")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task not found"
