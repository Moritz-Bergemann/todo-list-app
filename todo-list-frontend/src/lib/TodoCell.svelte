<script lang="ts">
    export let done: boolean = false;
    export let description;
</script>

<div class="todo-item">
    <p>
        [{done ? "X" : " "}] {description}
    </p>    
</div>


<style>
    .todo-item {
        background-color: cornflowerblue;
        width: 200px;
        margin: 5px;
        padding: 10px;
    }
</style>
