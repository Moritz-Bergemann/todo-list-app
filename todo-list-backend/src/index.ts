import express, { type Request, type Response } from 'express';
import type { TodoItem } from "./types";
import { getElement } from './methods';

const app = express();
const port = 3000;

let counter = 0;
const todoItems: TodoItem[] = [];

app.get("/", (req: Request, res: Response) => {
    res
        .setHeader("Access-Control-Allow-Origin","*")
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
});