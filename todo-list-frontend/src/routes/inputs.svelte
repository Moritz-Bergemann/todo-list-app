<script lang="ts">
    export let description: String;
    export let button;
</script>

<input name="new-todo-description" bind:value={description} />
<button class="new-todo-button" on:click={button}>Add new todo</button>
