import grpc
import os
from typing import Optional
from fastapi import FastAPI, HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
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

@app.get("/todos/{id}", response_model=Todo)
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
