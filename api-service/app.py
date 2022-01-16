from flask import Flask
from protobuf import auth_pb2

app = Flask(__name__)

@app.get("/")
def home():
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
