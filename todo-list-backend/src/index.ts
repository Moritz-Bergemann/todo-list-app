import express, { type Request, type Response } from "express";
import type { TodoItem, CreateTodoItemRequest } from "./types";
// import cors from "cors";
import cors from "cors";

const app = express();
const port = 3000;
app.use(express.json());
app.use(
	cors({
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
	}),
);

// State (count the number of requests)
let idCounter = 0;

const todos: TodoItem[] = [];

// Add a todo item
app.post("/todo-item", (req: Request, res: Response) => {
	const todoRequest: CreateTodoItemRequest = req.body;

	const newTodoItem: TodoItem = {
		id: idCounter,
		description: todoRequest.description,
		isDone: false,
	};

	idCounter++;

	todos.push(newTodoItem);

	res.status(200).send(newTodoItem); // In REST APIs, it is customary for create-type requests (POST) to return the entire created item
});

// Get all the todos
app.get("/todo-item", (req: Request, res: Response) => {
	res.status(200).json(todos);
});

app.get("/", (req: Request, res: Response) => {
	res.status(200).send("This is the to-do list backend!");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
