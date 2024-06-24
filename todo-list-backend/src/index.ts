import express, { type Request, type Response } from 'express';
import { readFileSync, writeFileSync } from 'fs'
import type { TodoItem } from "./types";
import { saveTodoList, readTodoList } from './fileIO';
import { error } from 'console';

const app = express();
const port = 3000;

let todoItems: TodoItem[] = [];
let counter = 0;
const todoItems: TodoItem[] = [];

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send("ping recieved");
});

app.get("/refresh-todos",(req: Request, res: Response) => {
    todoItems = readTodoList()
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(todoItems))
    ;
});

app.get("/get-todos",(req: Request, res: Response) => {
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(todoItems))
    ;
});

app.post("/add-todo",(req: Request, res: Response) => {

    console.log("adding todo from JSON")
    console.log(req.body)
    if ( req.body == undefined ){
        res
            .setHeader('Access-Control-Allow-Origin','*')
            .status(400)
            .send("request had no body")
        ;return
    }
    let id
    
    if ( todoItems.length == 0 ) {
        id = 0
    }else{
        id = todoItems[todoItems.length-1].id + 1
    }

    const newToDo: TodoItem = {
        id: id,
        name: req.body.name,
        isDone: false
    };

    todoItems.push(newToDo);

    saveTodoList(todoItems)

    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(newToDo))
    ;

});

app.post("/remove-todo",(req: Request, res: Response) => {
    const request = JSON.parse(req.body);
    const id = request.id;
    const name = request.name;

    let idx = todoItems.findIndex((value, index, list) => {value.id == id})

    if ( idx == -1 ) {
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("no such element")
    }else{
        saveTodoList(todoItems)
        let removedElement = todoItems.splice(idx,1)[0]
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(200)
            .send(JSON.stringify(removedElement))
    }
});

app.post("/tag-task-as-complete",(req: Request, res: Response) => {
    const request = JSON.parse(req.body);
    const id = request.id
    const strict = request.strict;
    let result
    try{
        result = changeCompletionStatusHandler(id, strict, true)
    }catch(e){
        if ( e instanceof Error ){
            res
                .setHeader("Access-Control-Allow-Origin","*")
                .status(400)
                .send(e.message)
            ;
        }else{
            res
                .setHeader("Access-Control-Allow-Origin","*")
                .status(500)
                .send("unknown backend error")
        }
        return
    }
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(result))
});

app.post("/tag-task-as-incomplete",(req: Request, res: Response) => {
    const request = JSON.parse(req.body);
    const id = request.id
    const strict = request.strict;
    let result
    try{
        result = changeCompletionStatusHandler(id, strict, false)
    }catch(e){
        if ( e instanceof Error ){
            res
                .setHeader("Access-Control-Allow-Origin","*")
                .status(400)
                .send(e.message)
            ;
        }else{
            res
                .setHeader("Access-Control-Allow-Origin","*")
                .status(500)
                .send("unknown backend error")
        }
        return
    }
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(result))
});

function changeCompletionStatusHandler(id: number, strict: boolean, newStatus: boolean) {
    let idx = todoItems.findIndex((value, _, __) => {value.id == id})

    if ( idx == -1 ) {  throw new Error("no such element")    }
    if ( strict && !(Number(newStatus) ^ Number()) ){   throw new Error("element is already in desired state")    }

    todoItems[idx].isDone = newStatus

    saveTodoList(todoItems)

    return todoItems[idx]
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});