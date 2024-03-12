<!-- 
Things to add:

1) Add feature
2) Remove feature
3) Edit feature
4) Save tasks to JSON file
5) Upload tasks to JSON file
6) ID feature to remember user 
-->

<script lang="ts">
    let pingResponseMessage: string;
    let pingResponseCount: number;
    let tempName = '';
    let taskName: string;
    let taskArray = [];
 
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
        if (tempName == '') {
            taskName = undefined;
        }
        else{
            taskName = tempName;
            taskArray.push(taskName)
        }
    }
    
    async function deleteTask() {
        // Delete tasks to the Backend
    }
    
    async function updateTask() {
        // Update tasks to the Backend
    }

    async function saveTask() {
        // Export tasks to the Backend
    }
    
</script>
 
<h1>POGGERS Ping Pong</h1>

<div>
    <button on:click={ping}>
        Do Ping
    </button>
</div>

{#if pingResponseMessage != undefined}
    <p>The ping response message was: {pingResponseMessage}</p>
    <p>The ping response count was: {pingResponseCount}</p>
{/if}

<input bind:value={tempName} placeholder="Enter Task" />

<div>
    <button on:click={addTask}>
        Add Task
    </button>
</div>

{#if taskName != undefined}
    <p>The task you added was: {taskName}</p>
{/if}

{#if taskArray != undefined}
    <p>Current Tasks: {taskArray.join(', ')}</p>
{/if}

<div>
    <button on:click={deleteTask}>
        Delete Task
    </button>
</div>

<div>
    <button on:click={updateTask}>
        Update Task
    </button>
</div>

<div>
    <button on:click={saveTask}>
        Save Task
    </button>
</div>

