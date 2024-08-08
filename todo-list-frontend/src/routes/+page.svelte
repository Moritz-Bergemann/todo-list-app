
<script lang='ts'>
	import { onMount } from "svelte";
    import type { TodoItem } from "./types";

    let TodoList: TodoItem[] = []
    let newTaskName: string = ""

    async function getTodos() {
        const response = await fetch("http://localhost:3000/get-todos")
        if(!response.ok){
            console.log('failed to get todo list with response:: '+response.status)
            throw new Error('get todos failed')
        }

        TodoList = await response.json()

        console.log('::to do list updated::\n' + JSON.stringify(TodoList))
        
    }

    async function addTask(taskName: string) {

        if(taskName != '') {
            console.log('adding todo of name:: '+taskName)
            const response = await fetch("http://localhost:3000/add-todo", {
                method: 'POST',
                body: JSON.stringify({name: taskName}),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if(!response.ok){
                console.log("add task failed:: "+response.status)
                throw new Error("add task failed");
            }

            //  get the list to still update, without needing to replace the list

            getTodos()

            console.log('todo added of name:: '+taskName)
        }else{
            console.log('task name is blank.  adding nothing')
        }
        console.log('::todoList::')
        console.log(JSON.stringify(TodoList))
    }

    async function deleteTask(taskid: number) {
        console.log('deleting task id:: '+taskid)
    
        const response = await fetch("http://localhost:3000/remove-todo", {
            method: "POST",
            body: JSON.stringify({id: taskid}),
            headers: {
                "Content-Type":"application/json"
            }
        })

        if(!response.ok) {
            console.log('remove task failed:: '+response.status)
            throw new Error('remove task failed')
        }

        getTodos()

        console.log('removed todo of id:: '+taskid)
    }

    async function markAsDone(taskid: number) {
        console.log('marking as done task of id:: '+taskid)

        const response = await fetch("http://localhost:3000/tag-task-as-complete", {
            method: 'POST',
            body: JSON.stringify({id: taskid}),
            headers: {
                'Content-Type':'application/json'
            }
        })

        if(!response.ok){
            console.log('failed to mark as complete task of id:: '+taskid+'\nfailed with response code:: '+response.status)
            throw new Error('failed to tag as complete')
        }

        getTodos()

        console.log('sucsessfully marked as done task of id:: '+taskid)
    }
    async function markAsIncomplete(taskid: number) {
        console.log('marking as done task of id:: '+taskid)

        const response = await fetch("http://localhost:3000/tag-task-as-incomplete", {
            method: 'POST',
            body: JSON.stringify({id: taskid}),
            headers: {
                'Content-Type':'application/json'
            }
        })

        if(!response.ok){
            console.log('failed to mark as incomplete task of id:: '+taskid+'\nfailed with response code:: '+response.status)
            throw new Error('failed to tag as incomplete')
        }

        getTodos()

        console.log('sucsessfully marked as incomplete task of id:: '+taskid)
    }

    onMount(() => {
        getTodos()
    })
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
            "
            width: 250px; height: 580px;
            position: relative; left: 270px; top: 10px;
            border: 2px solid black; background-color: #00FF1C;
            border-radius:10px
            "
        >
            <h2>
                Tasks
            </h2>
            {#each TodoList as task}
                <div style=
                    "
                    width: 230px; height 100px;
                    position: relative; left: 5px; top: 5px;
                    border: 2px solid black; background-color: #FFB000;
                    border-radius: 50px
                    "
                >
                    <p style= "position:relative; right: -10px">
                        {task.name}
                    </p>
                    <!--    get this to align to the right of parragraph    -->
                    <p>
                        {task.isDone ? "x" : " "}
                    </p>
                    <!--    get this button to align to the right of the parragraph    -->
                    <button on:click={() => deleteTask(task.id)}>delete task</button>
                    {#if task.isDone}
                        <button on:click={() => markAsIncomplete(task.id)}> mark as not done </button>
                    {:else}
                        <button on:click={() => markAsDone(task.id)}> mark as done </button>
                    {/if}
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
            <input style= "position: relative; left: 40px" bind:value={newTaskName}>
            <div style="position: relative; left: 87px; top: 10px">
                <button on:click={() => addTask(newTaskName)}> Add Task </button>
            </div>
        </div>
    </div>
</body>