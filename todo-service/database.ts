import { Collection, MongoClient, WithId, ObjectId } from "mongodb";
import { NewTodo, Todo, TodoIdentifier } from "./types";

export class DatabaseClient {
    private client: MongoClient;
    private collection!: Collection<NewTodo>;
    private COLLECTION_NAME = 'todos';

    constructor() {
        this.client = new MongoClient(this.getConnectionUri());
    }

    private getConnectionUri() {
        const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_PORT } = process.env;
        return `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}?retryWrites=true&writeConcern=majority`;
    }

    async initialize() {
        await this.client.connect();
        this.collection = this.client.db(process.env.DB_NAME).collection(this.COLLECTION_NAME);
    }

    private mongoObjToTodo(dbTodo: WithId<NewTodo>): Todo {
        const { username, title, _id } = dbTodo;
        return {
            username,
            title,
            id: _id.toString(),
        };
    }

    async getTodosByUsername(username: string): Promise<Todo[]> {
        const results = await (await this.collection.find({ username })).toArray();
        return results.map(this.mongoObjToTodo);
    }

    async createTodo(todo: NewTodo): Promise<Todo> {
        if (!todo.title || !todo.username) {
            throw new Error("Title or Username can't be blank!");
        }

        const { insertedId } = await this.collection.insertOne(todo);
        return {
            ...todo,
            id: insertedId.toString(),
        };
    }

    async getTodoById(todoIdentifier: TodoIdentifier): Promise<Todo> {
        const todo = await this.collection.findOne({ _id: new ObjectId(todoIdentifier.id), username: todoIdentifier.username });
        if (!todo) {
            throw new Error("No todo found!");
        }
        return this.mongoObjToTodo(todo);
    }

    async updateTodo(todo: Todo): Promise<Todo> {
        if (!todo.title) {
            throw new Error("Title can't be blank!");
        }

        const updateRes = await this.collection.updateOne(
            { _id: new ObjectId(todo.id), username: todo.username },
            { $set: { title: todo.title } }
        );
        if (!updateRes.matchedCount) {
            throw new Error("No todo found!");
        }
        return todo;
    }

    async deleteTodo(todoId: TodoIdentifier): Promise<void> {
        const deleteRes = await this.collection.deleteOne({
            _id: new ObjectId(todoId.id),
            username: todoId.username
        });
        if (!deleteRes.deletedCount) {
            throw new Error("No todo found!");
        }
    }
}
