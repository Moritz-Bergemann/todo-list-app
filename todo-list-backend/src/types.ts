export type TodoItem = {
    id: number
    description: string;
    isDone: boolean;
}

export type CreateTodoItemRequest = {
    description: string;
}

export type DeleteTodoItemRequest = {
    id: number;
}

export type UpdateTodoItemRequest = {
    id: number
    isDone: boolean
}