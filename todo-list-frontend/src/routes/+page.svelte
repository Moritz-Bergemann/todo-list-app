
<script lang='ts'>
    import type { TodoItem } from "./types";
    import TodoItemDisplay from "$lib/TodoItemDisplay.svelte";

	/** @type {import('./types.ts').TestToDoList} */
	export let data;

    let TodoList: TodoItem[] = data.list
    let newTaskInputBoxContents: string = ""
    let pingResponseMessage: string;
    let pingResponseCount: number;
    let tempName = '';
    let taskName: string;
    let taskArray: any[] = [];
    let taskJSON: TodoItem[] = [];
    let wipth = 0

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

            wipth = calculateWipth(taskJSON)

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

        console.log('successfully added:: '+newTaskInputBoxContents)

        console.log('::tasks on list::')
        for (let ii = 0; ii < TodoList.length; ii++) {
            console.log(JSON.stringify(TodoList[ii]));
            
        }
    }
</script>

<head>
    <style>
        h1 {text-align: center}
        h2 {text-align: center}
    </style>
</head>

<body>
    <h1>
        POGGERS To-do list
    </h1>
    <div style= 
        "width: 525px; height: 600px;
        border: 2px solid black; background-color: #79286C;
        border-radius:10px"
    >

        <div style=
            "width: 250px; height: 580px;
            position: relative; left: 270px; top:10px;
            border: 2px solid black; background-color: #00FF1C;
            border-radius:10px"
        >
            <h2>
                Tasks
            </h2>
            {#each TodoList as task}
                <div style=
                    "width= 200px; height: 115px;
                    position: relitive; left: 5px; top: 5px;
                    border: 2px solid black; background-color: #995da2;
                    border-radius:10px"
                >
                    <p>{task.name}</p>
                    <p>{task.isDone}</p>
                </div>
            {/each}
        </div>


        <div style="
        width: 250px; height: 150px;
        position: relative; left: 10px; top: -574px;
        border: 2px solid black; background-color: #808080;
        border-radius:10px
        ">
            <h2>Add new task</h2>
            <input style= "position: relative; left: 40px" bind:value={newTaskInputBoxContents}>
            <div style="position: relative; left: 87px; top: 10px">
                <button on:click={addTask}> Add Task </button>
            </div>
        </div>
    </div>
</body>
