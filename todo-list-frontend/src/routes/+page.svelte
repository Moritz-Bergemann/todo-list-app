<script lang="ts">
	import { onMount } from 'svelte';
	import Heading from './heading.svelte';
	import Inputs from './inputs.svelte';

	let todos: TodoItem[] = [];
	let newTodoDescription = '';

	async function getTodos() {
		const response = await fetch('http://localhost:3000/todo-item');
		const responseJson = await response.json();
		console.log(todos);
		todos = responseJson;
	}

	async function addTodoButtonclick() {
		const createTodoItemRequest: CreateTodoItemRequest = {
			description: newTodoDescription
		};
		const createTodoItemRequestJson = JSON.stringify(createTodoItemRequest);

		const response = await fetch('http://localhost:3000/todo-item', {
			method: 'POST', // This is a POST request, not the default GET
			headers: {
				'Content-Type': 'application/json', // We are sending JSON
				mode: 'no-cors' // no-cors, *cors, same-origin
			},
			body: createTodoItemRequestJson // The JSON we are sending
		});

		console.log(response);

		// Once the new todo is added, re-ask server for to-do items (NOTE: This is flawed in a number of ways. Why?)
		getTodos();
	}


	async function delTodoButtonClick(todoID: number) {
		const deleteTodoItemRequest: DeleteTodoItemRequest = {
			id: todoID
		};

		const deleteTodoItemRequestJson = JSON.stringify(deleteTodoItemRequest);

		const response = await fetch('http://localhost:3000/todo-item', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				mode: 'no-cors'
			},
			body: deleteTodoItemRequestJson
		});

		console.log(response);

		// Once the new todo is added, re-ask server for to-do items (NOTE: This is flawed in a number of ways. Why?)
		getTodos();
	}

	async function onCheckboxClick(isDone: boolean, id: number) {
		const updateTodoItemRequest: UpdateTodoItemRequest = {
			id: id,
			isDone: !isDone
		};
		const updateTodoItemRequestJson = JSON.stringify(updateTodoItemRequest);
		const response = await fetch('http://localhost:3000/todo-item', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				mode: 'no-cors'
			},
			body: updateTodoItemRequestJson
		});

		console.log(response);
		getTodos();
	}

	// This runs when the page is loaded into the browser
	onMount(() => {
		getTodos();
	});
	import Inputs_Component from './inputs.svelte';
</script>

<div class="body">
	<Heading></Heading>

	<div class="wrapper">
		<Inputs_Component description={newTodoDescription} button={addTodoButtonclick}></Inputs_Component>
		{#each todos as todo}
			<div class={todo.isDone ? 'done' : 'todo-item'}>
				<input
					type="checkbox"
					bind:checked={todo.isDone}
					on:click={() => onCheckboxClick(todo.isDone, todo.id)}
				/>
				{todo.description}
				<button on:click={() => delTodoButtonClick(todo.id)}>X</button>
			</div>
		{/each}
	</div>
</div>

<style>
	/* Lost values */
	.body {
		top:0px;
		left:0px;
		position: fixed;
		width: 100%;
		display: flex;
		justify-content: center;
		flex-flow: column;
		text-align: center;
		background-color: #FFEEFF;
	}

	.wrapper {
		font-family:'Balsamiq Sans', sans-serif;
		max-width: fit-content;
		align-self: center;
		background-color: #FFEEFF;
		display: flex;
		flex-flow: column;
		height: 100vh;
	}

	.todo-item {
		font-family:'Balsamiq Sans', sans-serif;
		width: 200px;
		margin: 5px;
		padding: 10px;
	}

	.done {
		opacity: 0.4;
		font-family:'Balsamiq Sans', sans-serif;
		width: 200px;
		margin: 5px;
		padding: 10px;
		text-decoration: line-through;
	}
</style>
