<<<<<<< HEAD
import express, { type Request, type Response } from 'express';
import { readFileSync, writeFileSync } from 'fs'
import type { TodoItem } from "./types";
import { saveTodoList, readTodoList } from './fileIO';
import { error } from 'console';

const app = express();
const port = 3000;

let todoItems: TodoItem[] = [];

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
        .send(newToDo)
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
=======
import express, { type Request, type Response } from 'express';
import type { TodoItem } from "./types";
import { getElement } from './methods';

const app = express();
const port = 3000;

let counter = 0;
let count = 0;
const todoItems: TodoItem[] = [];

app.get("/ping", (req: Request, res: Response) => {
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

app.get("/", (req: Request, res: Response) => {
    res
        .setHeader("Access-Control-Allow-Origin", "*")
        .status(200)
        .send("ping recieved");
});

app.get("/get-todos",(req: Request, res: Response) => {
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(todoItems))
    ;
});

app.post("/add-todo",(req: Request, res: Response) => {
    const newToDo: TodoItem = {
        id: counter,
        name: req.body.name,
        isDone: false
    };
    counter++;

    todoItems.push(newToDo);

    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(newToDo)
    ;

});

app.post("/remove-todo",(req: Request, res: Response) => {
    const request = JSON.parse(req.body);
    const id = request.id;
    const name = request.name;
    let idx = 0;
    let subject: TodoItem;
    try{
        subject = getElement(todoItems, id);
    }catch(e){
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(422)
            .send("no task of provided id")
        ;
        return;
    }
    if ( subject.name != name ) {
        res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(422)
        .send("task of given id dose not have given name")
        ;
    }else{
        let removedElement = todoItems.splice(idx, 1)[0];
        res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(removedElement))
        ;
    }

});

app.post("/tag-task-as-complete",(req: Request, res: Response) => {
    const request = JSON.parse(req.body);
    const id = request.id
    const strict = request.strict;

    let subject: TodoItem;
    try{
        subject = getElement(todoItems, id);
    }catch(e){
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(422)
            .send("no task of provided id")
        ;
        return;
    }
    if ( subject.isDone && strict ){
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(422)
            .send("task already complete")
        ;
        return;
    }
    subject.isDone = true;
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(subject))
    ;
});

app.post("/tag-task-as-incomplete", (req: Request, res: Response) => {
    const request = JSON.parse(req.body);
    const id = request.id
    const strict = request.strict;

    let subject: TodoItem;
    try{
        subject = getElement(todoItems, id);
    }catch(e){
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(422)
            .send("no task of provided id")
        ;
        return;
    }
    if ( !subject.isDone && strict ){
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(422)
            .send("task not yet complete complete")
        ;
        return;
    }
    subject.isDone = false;
    res
        .setHeader("Access-Control-Allow-Origin","*")
        .status(200)
        .send(JSON.stringify(subject))
    ;
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
>>>>>>> 1f0b11a4df38bdac43825ec4129380ec3135d485
});