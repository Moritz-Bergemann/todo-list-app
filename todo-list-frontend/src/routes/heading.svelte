<header>
    <div style="display:flex; flex-flow:row;">
        <img src="Folder.png" alt="Folder image" />
        <h1>POGGERS To-do list</h1>
    </div>
    <div class="folder-container">
        <img src="Folder.png" />
        <img src="Folder.png" />
        <img src="Folder.png" />
    </div>
</header>

<style>
    header {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        background-color: #e0d1ff;
        max-height: fit-content;
    }
    
    header h1 {
        max-height: fit-content;
        margin-top: 1vh;
        margin-bottom: 1vh;
        font-size: medium;
        font-family: 'Leckerli One', cursive;
        white-space: nowrap;
    }
    
    header img {
        max-width: 30px;
        max-height: 30px;
        margin-right: 1vw;
        margin-left: 1vw;
        margin-top: 0.5vh;
        margin-bottom: 0.5vh;
    }
    
    
    .folder-container {
        display: flex;
        flex-flow: row;
    }
</style>