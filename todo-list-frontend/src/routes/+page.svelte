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
    import type { TodoItem } from "./types";

    let pingResponseMessage: string;
    let pingResponseCount: number;
    let tempName = '';
    let taskName: string;
    let taskArray: any[] = [];
    let taskJSON: TodoItem[] = [];
    let numTasks = 0;

    async function addTask() {

        if(tempName != '') {
            console.log('adding todo of name:: '+taskName)
            taskName = tempName;
            await fetch("http://localhost:3000/add-todo", {
                method: 'POST',
                body: JSON.stringify({name: taskName}),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            
            // let response = await fetch("http://localhost:3000/add-todo", {taskName});
            let response = await fetch("http://localhost:3000/get-todos");

            // Get the JSON body from the request
            let responseJson = await response.json();

            // Set our pingResponse variable to change the UI
            taskJSON = responseJson;

            // Pushes string to an array
            taskArray.push(taskName)
            console.log('todo added of name:: '+taskName)
        }
    }

    async function deleteTask() {
        console.log('deleting task of with name:: '+tempName)
        if(tempName != '') {
            let task = taskJSON.find(function (value:TodoItem) {   return value.name == tempName  })
            if (    task != undefined   )
            {
                console.log('task found with name::\n'+JSON.stringify(task))
                await fetch("http://localhost:3000/remove-todo", {
                    method: 'POST',
                    body: JSON.stringify({"id": task.id}),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            }else{
                console.log('no task found of requested name')
            }
            
            let response = await fetch("http://localhost:3000/get-todos");

            // Get the JSON body from the request
            let responseJson = await response.json();

            // Set our pingResponse variable to change the UI
            taskJSON = responseJson.name;
        }
        // Delete tasks to the Backend
        console.log('deleted task with name:: '+tempName)
    }

    async function markAsDone() {
        console.log('marking as done task of name:: '+tempName)

        if(tempName != ''){
            let task = taskJSON.find(function (value:TodoItem) {   return value.name == tempName  })
            if (    task != undefined   )
            {
                console.log('task found under name::\n'+JSON.stringify(task))
                await fetch("http://localhost:3000/tag-task-as-complete", {
                    method: "POST",
                    body: JSON.stringify({"id": task.id, "strict": false}),
                    headers: {"Content-Type": "application/json"}
                })
            }
        }else{
            console.log('could not find task of requested name')
        }
        displayTasks()

        console.log('marked as done task of name:: '+tempName)
    }

    async function markAsNotDone() {
        console.log('marking as not done task of name:: '+tempName)

        if(tempName != ''){
            let task = taskJSON.find(function (value:TodoItem) {   return value.name == tempName  })
            if (    task != undefined   )
            {
                console.log('task found under name::\n'+JSON.stringify(task))
                await fetch("http://localhost:3000/tag-task-as-incomplete", {
                    method: "POST",
                    body: JSON.stringify({"id": task.id, "strict": false}),
                    headers: {"Content-Type": "application/json"}
                })
            }
        }else{
            console.log('could not find task of requested name')
        }
        displayTasks()

        console.log('marked as not done task of name:: '+tempName)
    }
    
    async function displayTasks() {
        console.log('displaying list::\n'+JSON.stringify(taskJSON))
        // Update tasks to the Backend
        let response = await fetch("http://localhost:3000/get-todos");

        // Get the JSON body from the request
        let responseJson = await response.json();

        // Set our pingResponse variable to change the UI
        taskJSON = responseJson;
        console.log('displayed list::\n'+JSON.stringify(taskJSON))
    }
    
</script>

<h1>POGGERS Todo List</h1>

{#if pingResponseMessage != undefined}
    <p>The ping response message was: {pingResponseMessage}</p>
    <p>The ping response count was: {pingResponseCount}</p>
{/if}

<p>Current Tasks:</p>
<p>
    {#each taskJSON as task, i}
        {task.id}:: {task.name}
        {#if task.isDone}
            |/
        {/if}
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
    <button on:click={markAsDone}>
        Mark task as complete
    </button>
</div>

<div>
    <button on:click={markAsNotDone}>
        Mark task is incomplete
    </button>
</div>

<div>
    <button on:click={displayTasks}>
        Display Task
    </button>
</div>

