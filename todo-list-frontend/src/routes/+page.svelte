
<script lang='ts'>
    import type { TodoItem } from "./types";

	/** @type {import('./types.ts').TestToDoList} */
	export let data;

    let TodoList: TodoItem[] = data.list
    let newTaskInputBoxContents: string = ""

    async function addTask() {
        console.log('Adding new task of name:: '+newTaskInputBoxContents)
        if(newTaskInputBoxContents == ""){
            console.log('not adding, as name is blank')
            return
        }
        let response = await fetch("http://localhost:3000/add-todo",{
            method: 'POST',
            body: JSON.stringify({
                name: newTaskInputBoxContents
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(!response.ok){
            throw new Error('request failed.  status:: '+response.status)
        }

        let newEntry = await response.json()

        TodoList.push(newEntry)

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
