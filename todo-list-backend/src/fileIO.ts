import type { TodoItem } from "./types"
import { readFileSync, writeFileSync } from 'fs'

export function saveTodoList(todoList: TodoItem[]){
    writeFileSync("./reasources/todolist", JSON.stringify(todoList))
}

export function readTodoList(){
    return JSON.parse(readFileSync("./reasources/todolist","utf-8"))
}