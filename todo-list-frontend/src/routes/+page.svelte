<!-- 
Things to add:

1) Add feature
2) Remove feature
3) Edit feature
4) Save tasks to JSON file
5) Upload tasks to JSON file
6) ID feature to remember user 

Things to work on
1) Search task array to delete stuff
-->


<script lang="ts">
	import type { stringify } from "querystring";
    import type { TodoItem } from "./types";

    let pingResponseMessage: string;
    let pingResponseCount: number;
    let tempName = '';
    let taskName: string;
    let taskArray: any[] = [];
    let taskJSON: TodoItem[] = [];
    let numTasks = 0;
 
    async function ping() {
        // Make a GET request to the ping-pong backend API 
        let response = await fetch("http://localhost:3000/ping");
        
        // Get the JSON body from the request
        let responseJson = await response.json();
 
        // Set our pingResponse variable to change the UI
        pingResponseMessage = responseJson.message;
        pingResponseCount = responseJson.count;
    }

    async function addTask() {
        // Add tasks to the Backend
        // if (tempName == '') {
        //     taskName = undefined;
        // }
        // else{
        //     taskName = tempName;
        //     taskArray.push(taskName)
        //     taskArray = taskArray;
        // }

        if(tempName != '') {
            taskName = tempName;
            await fetch("http://localhost:3000/add-todo", {
                method: 'POST',
                body: JSON.stringify({"name": taskName})
            });
            
            // let response = await fetch("http://localhost:3000/add-todo", {taskName});
            let response = await fetch("http://localhost:3000/get-todos");

            // Get the JSON body from the request
            let responseJson = await response.json();

            // Set our pingResponse variable to change the UI
            taskJSON = responseJson;

            // Pushes string to an array
            taskArray.push(taskName)
        }
    }

    async function deleteTask() {
        if(tempName != '') {
            taskName = tempName;
            fetch("http://localhost:3000/remove-todo", {
                method: 'POST',
                body: {id: 0}
            });
            
            // let response = await fetch("http://localhost:3000/add-todo", {taskName});
            let response = await fetch("http://localhost:3000/get-todos");

            // Get the JSON body from the request
            let responseJson = await response.json();

            // Set our pingResponse variable to change the UI
            taskJSON = responseJson.name;
        }

        else{
            taskName = undefined;
        }
        // Delete tasks to the Backend
    }
    
    async function displayTasks() {
        // Update tasks to the Backend
        let response = await fetch("http://localhost:3000/get-todos");

        // Get the JSON body from the request
        let responseJson = await response.json();

        // Set our pingResponse variable to change the UI
        taskJSON = responseJson;
    }
    
</script>
 
<h1>POGGERS Todo List</h1>

<div>
    <button on:click={ping}>
        Do Ping
    </button>
</div>

{#if pingResponseMessage != undefined}
    <p>The ping response message was: {pingResponseMessage}</p>
    <p>The ping response count was: {pingResponseCount}</p>
{/if}

<p>The task you added was: {taskName}</p>
<p>taskJSON = {JSON.stringify(taskJSON)}</p>

<p>Current Tasks:</p>
<p>
    {#each taskJSON as task, i}
        taskName: {taskArray[task.id]}
        <br>
        taskID: {task.id}
        <br>
        taskBool: {task.isDone}
        <br>
    {/each} 
</p>

<input bind:value={tempName} placeholder="Enter Task"/>

<div>
    <button on:click={addTask}>
        Add Task
    </button>
</div>

<div>
    <button on:click={deleteTask}>
        Delete Task
    </button>
</div>

<div>
    <button on:click={displayTasks}>
        Display Task
    </button>
</div>