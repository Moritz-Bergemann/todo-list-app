import express, { type Request, type Response } from 'express';
import { readFileSync, writeFileSync } from 'fs'
import type { TodoItem } from "./types";
<<<<<<< HEAD
import { getElement } from './methods';
import { Console } from 'console';
=======
import { saveTodoList, readTodoList } from './fileIO';
import { error } from 'console';
>>>>>>> ce55a1f1be86e157dd78ddcd3de4a50d4908d457

const app = express();
const port = 3000;

let todoItems: TodoItem[] = [];

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
<<<<<<< HEAD

    console.log("adding todo from JSON")
    console.log(req.body)
    if ( req.body == undefined ){
        res
            .setHeader('Access-Control-Allow-Origin','*')
            .status(400)
            .send("request had no body")
        ;return
    }
=======
    let id
    
    if ( todoItems.length == 0 ) {
        id = 0
    }else{
        id = todoItems[todoItems.length-1].id + 1
    }

>>>>>>> ce55a1f1be86e157dd78ddcd3de4a50d4908d457
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
<<<<<<< HEAD
            .send("no task of provided id")
        ;
        return;
    }
    if ( subject.name != name ) {
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("task of given id dose not have given name")
        ;
=======
            .send("no such element")
>>>>>>> ce55a1f1be86e157dd78ddcd3de4a50d4908d457
    }else{
        saveTodoList(todoItems)
        let removedElement = todoItems.splice(idx,1)[0]
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(200)
            .send(JSON.stringify(removedElement))
<<<<<<< HEAD
        ;
=======
>>>>>>> ce55a1f1be86e157dd78ddcd3de4a50d4908d457
    }
});

app.post("/tag-task-as-complete",(req: Request, res: Response) => {
<<<<<<< HEAD
    const request = JSON.parse(req.body),
          id = request.id,
          strict = request.strict;

    let subject: TodoItem;
=======
    const request = JSON.parse(req.body);
    const id = request.id
    const strict = request.strict;
    let result
>>>>>>> ce55a1f1be86e157dd78ddcd3de4a50d4908d457
    try{
        result = changeCompletionStatusHandler(id, strict, true)
    }catch(e){
<<<<<<< HEAD
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("no task of provided id")
        ;
        return;
    }
    if ( subject.isDone && strict ){
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("task already complete")
        ;
        return;
    }
    subject.isDone = true;
=======
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
>>>>>>> ce55a1f1be86e157dd78ddcd3de4a50d4908d457
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
<<<<<<< HEAD
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("no task of provided id")
        ;
        return;
    }
    if ( !subject.isDone && strict ){
        res
            .setHeader("Access-Control-Allow-Origin","*")
            .status(400)
            .send("task not yet complete complete")
        ;
        return;
    }
    subject.isDone = false;
=======
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
>>>>>>> ce55a1f1be86e157dd78ddcd3de4a50d4908d457
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