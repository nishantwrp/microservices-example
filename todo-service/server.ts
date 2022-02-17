require('dotenv').config()

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { DatabaseClient } from "./database";
import { NewTodo, Todo, TodoCreator, TodoIdentifier, TodosList } from "./types";
import { grpcFunctionWrap } from "./utils";

const PORT = 3006;

const url = `0.0.0.0:${PORT}`;
const server = new grpc.Server();
const proto = grpc.loadPackageDefinition(protoLoader.loadSync("./protobuf/todo.proto"));
const dbClient = new DatabaseClient();

const getTodos = async (creator: TodoCreator): Promise<TodosList> => {
    return {
        todos: await dbClient.getTodosByUsername(creator.username),
    };
}

const createTodo = async (newTodo: NewTodo): Promise<Todo> => {
    return dbClient.createTodo(newTodo);
}

const getTodo = async (todoId: TodoIdentifier): Promise<Todo> => {
    return dbClient.getTodoById(todoId);
}

const updateTodo = async (todo: Todo): Promise<Todo> => {
    return dbClient.updateTodo(todo);
}

const deleteTodo = async (todoId: TodoIdentifier): Promise<void> => {
    return dbClient.deleteTodo(todoId);
}

server.addService((proto.todo_service as any).TodoService.service, {
    GetTodos: grpcFunctionWrap(getTodos),
    CreateTodo: grpcFunctionWrap(createTodo),
    GetTodo: grpcFunctionWrap(getTodo),
    EditTodo: grpcFunctionWrap(updateTodo),
    DeleteTodo: grpcFunctionWrap(deleteTodo),
} as any);

server.bindAsync(url, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        throw err;
    }

    dbClient.initialize().then(() => {
        server.start();
        console.log(`Todo Service started on: ${url}`);
    }, (err) => {
        throw err;
    });
});
