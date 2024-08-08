import type { TodoItem } from "./types"
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'

const REASOURCESPATH = __dirname + "/reasources"
const TODOLISTPATH = REASOURCESPATH + "/todoList"

export function saveTodoList(todoList: TodoItem[]){
    mkdirSync(REASOURCESPATH, { recursive: true })
    writeFileSync(TODOLISTPATH, JSON.stringify(todoList))
    console.log('overwritten todo list reasource at:: ' + TODOLISTPATH)
}

export function readTodoList(){
    let result
    if (existsSync(TODOLISTPATH)) {
        result =  JSON.parse(readFileSync(TODOLISTPATH,"utf-8"))
        console.log('read todo list from:: '+TODOLISTPATH)
        return result
    }
    console.log('no copy of todo list at:: '+TODOLISTPATH)
    console.log('creating new todo list')
    return []
}