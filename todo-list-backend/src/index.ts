import express, { type Request, type Response } from "express";
import type { TodoItem, CreateTodoItemRequest } from "./types";
// import cors from "cors";
import cors from "cors";

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

// State (count the number of requests)
let idCounter = 0;

let todos: TodoItem[] = [];

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

	res
		.setHeader("Access-Control-Allow-Origin", "*")
		.status(200)
		.send(newTodoItem); // In REST APIs, it is customary for create-type requests (POST) to return the entire created item
});

// Get all the todos
app.get("/todo-item", (req: Request, res: Response) => {
	res.setHeader("Access-Control-Allow-Origin", "*").status(200).json(todos);
});

// Check a todo
app.post("/todo-item/:todoId/check", (req: Request, res: Response) => {
	// Get the to-do item
	const todoId = Number.parseInt(req.params.todoId);
	const todo = todos.find((item) => item.id === todoId);

	if (!todo) {
		res.status(404).send(`Todo with ID '${todoId}' not found`);
		return;
	}

	todo.isDone = true;

	res.setHeader("Access-Control-Allow-Origin", "*").status(200).json(todo);
});

// Uncheck a todo
app.post("/todo-item/:todoId/uncheck", (req: Request, res: Response) => {
	// Get the to-do item
	const todoId = Number.parseInt(req.params.todoId);
	const todo = todos.find((item) => item.id === todoId);

	if (!todo) {
		res.status(404).send(`Todo with ID '${todoId}' not found`);
		return;
	}

	todo.isDone = false;

	res.setHeader("Access-Control-Allow-Origin", "*").status(200).json(todo);
});

// Delete a todo
app.delete("/todo-item/:todoId", (req: Request, res: Response) => {
	const todoId = Number.parseInt(req.params.todoId);

	const initLength = todos.length;
	todos = todos.filter((todo) => todo.id !== todoId);

	if (todos.length === initLength) {
		res.status(404).send(`Todo with ID '${todoId}' not found`);
	} else {
		res
			.setHeader("Access-Control-Allow-Origin", "*")
			.status(200)
			.send("item deleted");
	}
});

app.get("/", (req: Request, res: Response) => {
	res
		.setHeader("Access-Control-Allow-Origin", "*")
		.status(200)
		.send("This is the to-do list backend!");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
