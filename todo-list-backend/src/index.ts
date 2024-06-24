import express, { type Request, type Response } from "express";
import type { TodoItem, CreateTodoItemRequest } from "./types";
// import cors from "cors";
import cors from "cors";

const app = express();
const port = 3000;
const mongoose = require('mongoose');
app.use(express.json());
app.use(cors());

// This has my password hardcoded, teehee!
mongoose.connect('mongodb+srv://joleenchong:R4KNFakc3Sfy840X@cluster0.jq5llig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
	.then(() => console.log('Connected to MongoDB'));
	
// State (count the number of requests) - I'll probably replace this with something that will count my MongoDB entries instead
let idCounter = 0;

// This is a schema that will map to a MongoDB collection and defines the shape of the documents within that collection.
const todoSchema = new mongoose.Schema({
	id: Number,
	description: String,
	isDone: Boolean
});

// This converts the schema into a Model.
const Todo = mongoose.model('Todo', todoSchema);

async function createTodo(description:String) {
	// Creating an instance of the Todo model - a Document
	const newTodoItem = new Todo({
		id: idCounter,
		description: description,
		isDone: false
	})

	// This saves the new todo item into the database and stores the result in a constant.
	return await newTodoItem.save();
}

// Returns all the todo items in the MongoDB database
async function getTodos()
{
	return await Todo.find({});
}

// Add a todo item
app.post("/todo-item", (req: Request, res: Response) => {
	const todoRequest: CreateTodoItemRequest = req.body;

	const newTodoItem = createTodo(todoRequest.description);
	idCounter++;
	
	res
		.setHeader("Access-Control-Allow-Origin", "*")
		.status(200)
		.send(newTodoItem); // In REST APIs, it is customary for create-type requests (POST) to return the entire created item
});

// Get all the todos
app.get("/todo-item", async (req: Request, res: Response) => {
	const todolist = await getTodos();
	res
		.setHeader("Access-Control-Allow-Origin", "*")
		.status(200)
		.send(todolist);
});

app.get("/", (req: Request, res: Response) => {
	res
		.setHeader("Access-Control-Allow-Origin", "*")
		.status(200)
		.send("This is the to-do list backend!");
});

// Updates an existing todo item in the database
app.put("/todo-item",async (req: Request, res: Response) => {
	const id = new mongoose.Types.ObjectId(req.params.id);
	const todo = await Todo.findOne({_id:id});
	// I'll actually figure out which fields to change later.
	todo.set({
		description: req.params.description,
		isDone: req.params.isDone
	});
	const result = await todo.save();
	res
		.setHeader("Access-Control-Allow-Origin", "*")
		.status(200)
		.send(result);
});

// Deletes by hashing the id in params into an ObjectId and then search in database for matching ObjectId to delete
app.delete("/todo-item", async (req: Request, res: Response) => {
	const id = new mongoose.Types.ObjectId(req.params.id);
	await Todo.deleteOne({_id:id});
	res
		.setHeader("Access-Control-Allow-Origin", "*")
		.status(200)
		.send("Delete done");
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
