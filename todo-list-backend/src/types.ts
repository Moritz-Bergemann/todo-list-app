export type TodoItem = {
    id: number
    description: string;
    isDone: boolean;
}

export type CreateTodoItemRequest = {
    description: string;
}
