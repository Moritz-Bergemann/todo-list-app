<script lang="ts">
    let pingResponseMessage: string;
    let pingResponseCount: number;
 
    async function ping() {
        // Make a GET request to the ping-pong backend API 
        let response = await fetch("http://localhost:3000/ping");
        
        // Get the JSON body from the request
        let responseJson = await response.json();
 
        // Set our pingResponse variable to change the UI
        pingResponseMessage = responseJson.message;
        pingResponseCount = responseJson.count;
    }
</script>
 
<h1>POGGERS Ping Pong</h1>

<button on:click={ping}>Do Ping</button>

{#if pingResponseMessage != undefined}
    <p>The ping response message was: {pingResponseMessage}</p>
    <p>The ping response count was: {pingResponseCount}</p>
{/if}
