import express, { type Request, type Response } from 'express';
import type { TodoItem } from "./types";
import { saveTodoList, readTodoList } from './fileIO';
import { error } from 'console';
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
        .status(200)
        .json(responseContent);
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
            .status(400)
            .send("request body undefined.  sending response code 400")
            ; console.log("request body undefined.  sending response code 400"); return
    }

    if (req.body.name == undefined) {
        res
            .status(400)
            .send("task name undefined.  sending response code 400")
            ; console.log("task name undefined.  sending response code 400"); return
    }

    if (todoItems.findIndex(function (item) { return item.name == req.body.name}) != -1){
        // if a task of this name already exists in this list
        res
            .status(400)
            .send('to do list already contains element of this name')
            ; console.log('task already in list.  did not add element of name:: '+req.body.name); return
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
        .status(200)
        .send(JSON.stringify(newTodo))
        ; console.log(JSON.stringify(newTodo)); return
});

app.post("/remove-todo", express.json(), (req: Request, res: Response) => {
    console.log("removing todo")

    if (req.body == undefined) {
        res
            .status(400)
            .send("request body undefined.  sending response code 400")
            ; console.log("request body undefined.  sending response code 400"); return
    }

    if (req.body.id == undefined) {
        res
            .status(400)
            .send("task id undefined.  sending response code 400")
            ; console.log("task id undefined.  sending response code 400"); return
    }

    let id = req.body.id

    console.log("removing task id:: " + id)

    let idx = todoItems.findIndex(function (item) { return item.id == id })

    if (idx == -1) {
        res
            .status(400)
            .send("no element in list of requested index")
            ; console.log("no element in list of requested index"); return
    }

    let removedElement = todoItems.splice(idx, 1)[0]

    saveTodoList(todoItems)

    res
        .status(200)
        .send(JSON.stringify(removedElement))
});

app.post("/tag-task-as-complete", express.json(), (req: Request, res: Response) => {
    console.log("tagging task as complete")
    const request = req.body;
    const id = request.id
    let result
    try {
        result = changeCompletionStatusHandler(id, true)
    } catch (e) {
        if (e instanceof Error) {
            res
                .status(400)
                .send(e.message)
                ;
        }
        return
    }
    res
        .setHeader("Access-Control-Allow-Origin", "*")
        .status(200)
        .send(JSON.stringify(result))
    console.log('task tagged as complete')
});

app.post("/tag-task-as-incomplete", express.json(), (req: Request, res: Response) => {
    console.log("tagging task as incomplete")
    const request = req.body;
    const id = request.id
    let result
    try {
        result = changeCompletionStatusHandler(id, false)
    } catch (e) {
        if (e instanceof Error) {
            res
                .status(400)
                .send(e.message)
                ;
        } else {
            res
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

function changeCompletionStatusHandler(id: number, newStatus: boolean) {
    console.log('changeing status of:: '+id+" ::to:: "+newStatus)
    let idx = todoItems.findIndex(function (value) { return value.id == id })

    if (idx == -1) { throw new Error("no such element") }

    todoItems[idx].isDone = newStatus

    saveTodoList(todoItems)

    return todoItems[idx]
}

app.listen(port, () => {
    todoItems = readTodoList()
    console.log(`Server running at http://localhost:${port}`);
});