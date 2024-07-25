<script lang="ts">
    export let description: String;
    export let button;
</script>

<div class="wrapper">
    <input name="new-todo-description" placeholder="Add a new todo" bind:value={description} />
    <button class="new-todo-button" on:click={button}>
        <img src="Icon.png" />
    </button>
</div>

<style>
    .wrapper{
        display: flex;
        flex-flow: row;
        padding: 1rem;
        justify-content: center;
        gap: 0.3rem;
        position: sticky;
    }

    input {
        font-family:'Balsamiq Sans', sans-serif;
    }

    .new-todo-button img {
        object-fit: cover;
    }
</style>