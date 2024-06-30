import express, { type Request, type Response } from 'express';
import { readFileSync, writeFileSync } from 'fs'
import type { TodoItem } from "./types";
import { saveTodoList, readTodoList } from './fileIO';
import { error } from 'console';
import { json } from 'stream/consumers';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors({
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
}));

// Just putting these here for debugging purposes
let count = 0;

let todoItems: TodoItem[] = [];

app.get("/", (req: Request, res: Response) => {
    console.log("pinging")
    res
        .status(200)
        .send("ping recieved");
});

// Just putting these here for debugging purposes
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

app.get("/refresh-todos", (req: Request, res: Response) => {
    console.log("refreshing todo list")
    todoItems = readTodoList()
    res
        .setHeader("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(JSON.stringify(todoItems))
        ;
});

app.get("/get-todos", (req: Request, res: Response) => {
    console.log("sending todo list")
    res
        .status(200)
        .send(JSON.stringify(todoItems))
        ;
    console.log('get todos request returned:: ' + JSON.stringify(todoItems))
});

app.post("/add-todo", express.json(), (req: Request, res: Response) => {
    console.log("adding todo")

    if (req.body == undefined) {
        res
            .setHeader("Access-Control-Allow-Origin", "*")
            .status(400)
            .send("request body undefined.  sending response code 400")
            ; console.log("request body undefined.  sending response code 400"); return
    }

    if (req.body.name == undefined) {
        res
            .setHeader("Access-Control-Allow-Origin", "*")
            .status(400)
            .send("task name undefined.  sending response code 400")
            ; console.log("task name undefined.  sending response code 400"); return
    }

    let id
    if (todoItems.length == 0) {
        id = 0
    } else {
        id = todoItems[todoItems.length - 1].id + 1
    }

    const newTodo = {
        id: id,
        name: req.body.name,
        isDone: false
    }

    todoItems.push(newTodo)

    saveTodoList(todoItems)

    res
        .setHeader("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(JSON.stringify(newTodo))
        ; console.log(JSON.stringify(newTodo)); return
});

app.post("/remove-todo", express.json(), (req: Request, res: Response) => {
    console.log("removing todo")

    if (req.body == undefined) {
        res
            .setHeader("Access-Control-Allow-Origin", "*")
            .status(400)
            .send("request body undefined.  sending response code 400")
            ; console.log("request body undefined.  sending response code 400"); return
    }

    if (req.body.id == undefined) {
        res
            .setHeader("Access-Control-Allow-Origin", "*")
            .status(400)
            .send("task id undefined.  sending response code 400")
            ; console.log("task id undefined.  sending response code 400"); return
    }

    let id = req.body.id

    console.log("removing task id:: " + id)

    let idx = todoItems.findIndex(function (item) { return item.id == id })

    if (idx == -1) {
        res
            .setHeader("Access-Control-Allow-Origin", "*")
            .status(400)
            .send("no element in list of requested index")
            ; console.log("no element in list of requested index"); return
    }

    let removedElement = todoItems.splice(idx, 1)[0]

    res
        .setHeader("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(JSON.stringify(removedElement))
});

app.post("/tag-task-as-complete", (req: Request, res: Response) => {
    console.log("tagging task as complete")
    const request = req.body;
    const id = request.id
    const strict = request.strict;
    let result
    try {
        result = changeCompletionStatusHandler(id, strict, true)
    } catch (e) {
        if (e instanceof Error) {
            res
                .setHeader("Access-Control-Allow-Origin", "*")
                .status(400)
                .send(e.message)
                ;
        } else {
            res
                .setHeader("Access-Control-Allow-Origin", "*")
                .status(500)
                .send("unknown backend error")
        }
        return
    }
    res
        .setHeader("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(JSON.stringify(result))
});

app.post("/tag-task-as-incomplete", (req: Request, res: Response) => {
    console.log("tagging task as incomplete")
    const request = req.body;
    const id = request.id
    const strict = request.strict;
    let result
    try {
        result = changeCompletionStatusHandler(id, strict, false)
    } catch (e) {
        if (e instanceof Error) {
            res
                .setHeader("Access-Control-Allow-Origin", "*")
                .status(400)
                .send(e.message)
                ;
        } else {
            res
                .setHeader("Access-Control-Allow-Origin", "*")
                .status(500)
                .send("unknown backend error")
        }
        return
    }
    res
        .setHeader("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(JSON.stringify(result))
});

function changeCompletionStatusHandler(id: number, strict: boolean, newStatus: boolean) {
    let idx = todoItems.findIndex(function (value) { value.id == id })

    if (idx == -1) { throw new Error("no such element") }
    if (strict && !(Number(newStatus) ^ Number())) { throw new Error("element is already in desired state") }

    todoItems[idx].isDone = newStatus

    saveTodoList(todoItems)

    return todoItems[idx]
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});