<script lang="ts">
import { onMount } from "svelte";

let pingResponseMessage: string;
let pingResponseCount: number;

let todos: TodoItem[] = [];
let newTodoDescription = "";

async function getTodos() {
	const response = await fetch("http://localhost:3000/todo-item");
	const responseJson = await response.json();
	console.log(todos);
	todos = responseJson;
}

async function addTodoButtonclick() {
	const createTodoItemRequest: CreateTodoItemRequest = {
		description: newTodoDescription,
	};
	const createTodoItemRequestJson = JSON.stringify(createTodoItemRequest);

	const response = await fetch("http://localhost:3000/todo-item", {
		method: "POST", // This is a POST request, not the default GET
		headers: {
			"Content-Type": "application/json", // We are sending JSON
			mode: "no-cors", // no-cors, *cors, same-origin
		},
		body: createTodoItemRequestJson, // The JSON we are sending
	});

	console.log(response);

	// Once the new todo is added, re-ask server for to-do items (NOTE: This is flawed in a number of ways. Why?)
	getTodos();
}

// This runs when the page is loaded into the browser
onMount(() => {
	getTodos();
});
</script>

<h1>POGGERS To-do list</h1>

<label for="new-todo-description">Description</label>
<input name="new-todo-description" bind:value={newTodoDescription}/>
<button on:click={addTodoButtonclick}>Add new todo</button>

{#each todos as todo}
	<div class="todo-item">[{todo.isDone ? "X" : " "}] {todo.description}</div>
{/each}


<style>
	.todo-item {
		background-color: cornflowerblue;
		width: 200px;
		margin: 5px;
		padding: 10px;
	}
</style>