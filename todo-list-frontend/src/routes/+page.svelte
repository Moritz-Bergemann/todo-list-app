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

		const response = await fetch('http://localhost:3000/todo-item', {
			method: 'POST', // This is a POST request, not the default GET
			headers: {
				'Content-Type': 'application/json', // We are sending JSON
				mode: 'no-cors' // no-cors, *cors, same-origin
			},
			body: JSON.stringify(createTodoItemRequest) // The JSON we are sending
		});

		console.log(response);

		// Once the new todo is added, re-ask server for to-do items (NOTE: This is flawed in a number of ways. Why?)
		getTodos();
	}

	async function delTodoButtonClick(todoID: number) {
		const deleteTodoItemRequest: DeleteTodoItemRequest = {
			id: todoID
		};

		const response = await fetch('http://localhost:3000/todo-item', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				mode: 'no-cors'
			},
			body: JSON.stringify(deleteTodoItemRequest)
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
		const response = await fetch('http://localhost:3000/todo-item', {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				mode: 'no-cors'
			},
			body: JSON.stringify(updateTodoItemRequest)
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

<div class="page">
	<Heading></Heading>
	
	<div class="body">
		<div class="wrapper">
			<Inputs_Component bind:description={newTodoDescription} button={addTodoButtonclick}></Inputs_Component>
			<div class="todos-list">
				{#each todos as todo}
				<div class={todo.isDone ? 'done' : 'todo-item'}>
					<input
					type="checkbox"
					bind:checked={todo.isDone}
					on:click={() => onCheckboxClick(todo.isDone, todo.id)}
					/>
					{todo.description}
					<button class="deleteButton" on:click={() => delTodoButtonClick(todo.id)}></button>
				</div>
				{/each}
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
				<p>content</p>
			</div>
		</div>
	</div>
</div>
	
	<style>
		/* Lost values */
	.page {
		top:0px;
		left:0px;
		position: fixed;
		width: 100vw;
		display: flex;
		justify-content: center;
		flex-flow: column;
		text-align: center;
		background-color: #FFEEFF;
	}

	.body {
		display: flex;
		flex-flow: row;
		justify-self: center;
		justify-items: center;
		justify-content: center;
		align-items: center;
	}

	.wrapper {
		align-self: center;
		font-family:'Balsamiq Sans', sans-serif;
		max-width: fit-content;
		align-self: center;
		background-color: #FFEEFF;
		flex: 1;
		display: flex;
		height: 100vh;
		flex-flow: column;
		overflow: scroll;
	}

	.todos-list {
		overflow: scroll;
		align-self: center;
		width: 100vw;
	}
	
	.todo-item {
		font-family:'Balsamiq Sans', sans-serif;
		width: auto;
		margin: 5px;
		padding: 10px;
	}

	.done {
		opacity: 0.4;
		font-family:'Balsamiq Sans', sans-serif;
		width: auto;
		margin: 5px;
		padding: 10px;
		text-decoration: line-through;
	}

	.wrapper {
	scrollbar-width: thin;
	scrollbar-color: transparent;
	}
	.wrapper:-webkit-scrollbar {
	width: 32px;
	}
	.wrapper:-webkit-scrollbar-track {
	background: transparent;
	}
	.wrapper:-webkit-scrollbar-thumb {
	border-radius: 12.74px;
	border: 3px solid transparent;
	}


	::-webkit-scrollbar {
    width: 10px;
	}
 
	::-webkit-scrollbar-track {
		background-color: #ebebeb;
		-webkit-border-radius: 10px;
		border-radius: 10px;
	}

	::-webkit-scrollbar-thumb {
		-webkit-border-radius: 10px;
		border-radius: 10px;
		background: #6d6d6d; 
	}

	.deleteButton {
		border: none;
		background-image: url("DeleteButton.png");
		background-repeat: no-repeat;
		background-color: transparent;
		vertical-align: middle;
		height: 24px;
		width: 24px;
	}

	.deleteButton:hover {
		opacity: 0.5;
	}

	input[type="checkbox"] {
		accent-color: #2fc8b4;
	}
</style>