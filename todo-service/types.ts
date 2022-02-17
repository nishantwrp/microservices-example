export interface Todo {
    id: string;
    title: string;
    username: string;
}

export interface NewTodo {
    title: string;
    username: string;
}

export interface TodoIdentifier {
    id: string;
    username: string;
}

export interface TodoCreator {
    username: string;
}

export interface TodosList {
    todos: Todo[];
}
