import grpc
import os
from typing import List
from fastapi import FastAPI, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from protobuf import auth_pb2, auth_pb2_grpc, todo_pb2_grpc, todo_pb2

load_dotenv()

AUTH_SERVICE_URL = os.environ['AUTH_SERVICE_URL']
TODO_SERVICE_URL = os.environ['TODO_SERVICE_URL']

app = FastAPI(
    title="API Service (Todo App)",
    version="0.1.0",
    docs_url="/"
)
security = HTTPBearer()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*'],
)

auth_service_channel = grpc.insecure_channel(AUTH_SERVICE_URL)
auth_service_stub = auth_pb2_grpc.AuthServiceStub(auth_service_channel)
todo_service_channel = grpc.insecure_channel(TODO_SERVICE_URL)
todo_service_stub = todo_pb2_grpc.TodoServiceStub(todo_service_channel)

class UserProfile(BaseModel):
    username: str
    name: str

class RegisterUser(BaseModel):
    username: str
    name: str
    password: str

class LoginUser(BaseModel):
    username: str
    password: str

class AuthToken(BaseModel):
    token: str

class Todo(BaseModel):
    id: str
    title: str

class NewTodo(BaseModel):
    title: str

def get_user(token: str):
    try:
        return auth_service_stub.AuthenticateUser(auth_pb2.Token(token=token))
    except grpc.RpcError:
        raise HTTPException(
            status_code=401,
            detail="invalid token"
        )

@app.post("/auth/login", response_model=AuthToken, tags=["auth"])
def login(user: LoginUser):
    try:
        token = auth_service_stub.LoginUser(auth_pb2.UserCredentials(username=user.username, password=user.password))
        return {"token": token.token}
    except grpc.RpcError as e:
        raise HTTPException(status_code=400, detail=e.details())

@app.post("/auth/register", response_model=AuthToken, tags=["auth"])
def register(user: RegisterUser):
    try:
        token = auth_service_stub.RegisterUser(auth_pb2.UserRegistrationForm(username=user.username, password=user.password, name=user.name))
        return {"token": token.token}
    except grpc.RpcError as e:
        raise HTTPException(status_code=400, detail=e.details())

@app.get("/auth/profile", response_model=UserProfile, tags=["auth"])
def profile(token: HTTPAuthorizationCredentials = Security(security)):
    user = get_user(token.credentials)
    return {
        "name": user.name,
        "username": user.username,
    }

@app.get("/todos/", response_model=List[Todo], tags=["todos"])
def get_todos(token: HTTPAuthorizationCredentials = Security(security)):
    user = get_user(token.credentials)
    todo_list_response = todo_service_stub.GetTodos(todo_pb2.TodoCreator(username=user.username))
    return list(map(lambda todo_obj: { "id": todo_obj.id, "title": todo_obj.title }, todo_list_response.todos))

@app.post("/todos/", status_code=201, response_model=Todo, tags=["todos"])
def create_todo(new_todo: NewTodo, token: HTTPAuthorizationCredentials = Security(security)):
    user = get_user(token.credentials)
    try:
        todo = todo_service_stub.CreateTodo(todo_pb2.NewTodo(title=new_todo.title, username=user.username))
        return {
            "id": todo.id,
            "title": todo.title
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=e.details())

@app.get("/todos/{id}", response_model=Todo, tags=["todos"])
def get_todo(id: str, token: HTTPAuthorizationCredentials = Security(security)):
    user = get_user(token.credentials)
    try:
        todo = todo_service_stub.GetTodo(todo_pb2.TodoIdentifier(id=id, username=user.username))
        return {
            "id": todo.id,
            "title": todo.title
        }
    except:
        raise HTTPException(status_code=404, detail="not found")

@app.put("/todos/{id}", response_model=Todo, tags=["todos"])
def update_todo(id: str, todo: Todo, token: HTTPAuthorizationCredentials = Security(security)):
    user = get_user(token.credentials)
    try:
        todo = todo_service_stub.EditTodo(todo_pb2.Todo(id=id, title=todo.title, username=user.username))
        return {
            "id": todo.id,
            "title": todo.title
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=e.details())

@app.delete("/todos/{id}", status_code=204, tags=["todos"])
def delete_todo(id: str, token: HTTPAuthorizationCredentials = Security(security)):
    user = get_user(token.credentials)
    try:
        todo_service_stub.DeleteTodo(todo_pb2.TodoIdentifier(id=id, username=user.username))
    except Exception as e:
        raise HTTPException(status_code=400, detail=e.details())
