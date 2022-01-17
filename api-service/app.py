import grpc
from flask import Flask
from protobuf import auth_pb2, auth_pb2_grpc

app = Flask(__name__)
auth_service_channel = grpc.insecure_channel('localhost:3005')
auth_service_stub = auth_pb2_grpc.AuthServiceStub(auth_service_channel)

@app.get("/")
def home():
    token = auth_service_stub.RegisterUser(auth_pb2.UserRegistrationForm(username="some", name="name", password="asdas"))
    print(token.token)
    return "<p>Todo App API Service</p>"

@app.post("/auth/register")
def register_user():
    return "<p>Hello, World!</p>"

@app.post("/auth/login")
def login_user():
    return "<p>Hello, World!</p>"

@app.get("/auth/profile")
def get_profile():
    return "<p>Hello, World!</p>"
