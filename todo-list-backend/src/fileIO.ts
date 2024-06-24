import type { TodoItem } from "./types"
import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const TODOLISTPATH = __dirname + "/reasources/todolist"
const REASOURCESPATH = __dirname + "/reasources"

export function saveTodoList(todoList: TodoItem[]){
    mkdirSync(REASOURCESPATH, { recursive: true })
    writeFileSync(TODOLISTPATH, JSON.stringify(todoList))
    console.log('overwritten todo list reasource at:: ' + TODOLISTPATH)
}

export function readTodoList(){
    let result =  JSON.parse(readFileSync(TODOLISTPATH,"utf-8"))
    console.log('read todo list from:: '+TODOLISTPATH)
    return result
}