type TodoItem = {
    id: number
    description: string;
    isDone: boolean;
}

type CreateTodoItemRequest = {
    description: string;
}

type DeleteTodoItemRequest = {
    id: number;
}

type UpdateTodoItemRequest = {
    id: number
    isDone: boolean
}