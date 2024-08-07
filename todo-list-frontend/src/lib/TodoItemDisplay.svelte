<script lang='ts'>

    export let done: boolean
    export let description: string
    export let wipth: number

</script>

<div class='todoItemDisplay' style='--wipth: wipth'>
    <p>
        {#if !done}
            {description}
        {:else}
            <del>{description}</del>
        {/if}
    </p>
</div>

<style>

    .todoItemDisplay {
        background-color: cornflowerblue;
        height: auto;
        width: var(--wipth);
        margin: auto;
    }

</style>