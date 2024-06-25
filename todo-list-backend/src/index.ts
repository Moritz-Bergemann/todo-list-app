import express, { type Request, type Response } from 'express';
import { readFileSync, writeFileSync } from 'fs'
import type { TodoItem } from "./types";
import { saveTodoList, readTodoList } from './fileIO';
import { error } from 'console';

const app = express();
const port = 3000;

// Just putting these here for debugging purposes
let count = 0;

let todoItems: TodoItem[] = [];

app.get("/", (req: Request, res: Response) => {
    console.log("pinging")
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send("ping recieved");
});

// Just putting these here for debugging purposes
app.get("/ping",  (req: Request, res: Response) => {
    count++;
    
    let responseContent = {
        message: "pong",
        count: count,
    };
    
    res
    .setHeader('Access-Control-Allow-Origin', '*')
    .status(200)
    .json(responseContent);
});

app.get("/refresh-todos",(req: Request, res: Response) => {
    console.log("refreshing todo list")
    todoItems = readTodoList()
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(todoItems))
    ;
});

app.get("/get-todos",(req: Request, res: Response) => {
    console.log("sending todo list")
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(todoItems))
    ;
    console.log('get todos request returned:: '+JSON.stringify(todoItems))
});

app.post("/add-todo",express.json(),(req: Request, res: Response) => {
    console.log("adding todo from request:: "+req.body)

    if ( req.body == undefined ){
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("request body undefined.  sending response code 400")
        ;console.log("request body undefined.  sending response code 400");return
    }

    if ( req.body.name == undefined ) {
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("task name undefined.  sending response code 400")
        ;console.log("task name undefined.  sending response code 400");return
    }

    let id
    if ( todoItems.length == 0){
        id = 0
    }else{
        id = todoItems[todoItems.length-1].id + 1
    }

    const newTodo = {
        id: id,
        name: req.body.name,
        isDone: false
    }

    todoItems.push(newTodo)

    saveTodoList(todoItems)

    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(newTodo))
    ;console.log(JSON.stringify(newTodo));return
});

app.post("/remove-todo",(req: Request, res: Response) => {
    console.log("removing todo")
    const request = req.body;

    if ( request == undefined ) {
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("request body undefined")
        ;console.log("request body undefined.  error 400 returned");return
    }

    const id = JSON.parse(request).id

    if ( id == undefined ) {
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("id undefined")
        ;console.log("id undefined.  error 400 returned");return
    }

    let idx = todoItems.findIndex(function (value) {return value.id == id})

    if ( idx == -1 ) {
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("no such element")
        console.log("element of id not found.  error 400 returned")
    }else{
        saveTodoList(todoItems)
        let removedElement = todoItems.splice(idx,1)[0]
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(200)
            .send(JSON.stringify(removedElement))
        console.log("element of id found.  element removed and returned with code 200")
    }
});

app.post("/tag-task-as-complete",(req: Request, res: Response) => {
    console.log("tagging task as complete")
    const request = req.body;
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
    console.log("tagging task as incomplete")
    const request = req.body;
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
    let idx = todoItems.findIndex(function (value) {value.id == id})

    if ( idx == -1 ) {  throw new Error("no such element")    }
    if ( strict && !(Number(newStatus) ^ Number()) ){   throw new Error("element is already in desired state")    }

    todoItems[idx].isDone = newStatus

    saveTodoList(todoItems)

    return todoItems[idx]
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});