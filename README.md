For this tutorial, I am assuming you are running Linux! Mac should work fine too, though you might have to go looking for the MacOS version of some tools. If you're on Windows, either (1) [install WSL](https://learn.microsoft.com/en-us/windows/wsl/install) or (2) be prepared to find your own alternatves.

## Setup

First, we'll install Node.JS and the Node package manager. NodeJS is a way for you to run Javascript for backend applications, rather than just inside the browser. **NPM** (Node Package Manager) comes with Node and is what we use to install packages (extral tools and libraries) for our node application.
```sh
# First, install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Refresh your bash to activate it (or restart your terminal)
source ~/.bashrc

# Install and activate LTS version of Node 
nvm install --lts
nvm use --lts
```

### Backend - Express.js
  First, create a new directory, then enter it:
```sh
mkdir todo-list-backend
cd todo-list-backend
```

NPM sets up your application by storing all its configurations in the folder you build you app in. The most important files managed by NPM are the `package.json` and `package.lock.json` files, which track what packages you have installed.

In the folder you created, initialise your Node app:
```sh
npm init -y
```

Now, install the Express and TypeScript NPM packages:
```sh
npm install express
npm install -D typescript @types/express @types/node
```

TypeScript adds a number of extensions and greatly changes parts of the process to building your application. Initialise these parts of your project like this:
```sh
npx tsc --init
```

This will generate a `tsconfig.json` file, which contains your configuration for Typescript. Replace the (very long) content of the file with the following:
```json
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

As one last piece of setup, we'll add the following lines to your `package.json` to allow us to run the backend using NPM:
```json
  "scripts": {
    "start": "ts-node src/index.ts",
    "build": "tsc",
    "serve": "node dist/index.js"
  },
```
Make sure to replace the original `"scripts"`... if it's there!

Your final `package.json` should look something like this:
```json
{
  "name": "todo-list-backend",
  "version": "1.0.0",
  "description": "todo list backend in express",
  "main": "index.js",
  "scripts": {
    "start": "ts-node src/index.ts",
    "build": "tsc",
    "serve": "node dist/index.js"
  },
  "author": "me",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.24",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
```

Now, we can write our TypeScript code! 

Inside your backend folder, create a `/src/` folder, and inside it a file named `index.ts`. 

In it, add the following code:
```js
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

There's a lot going on, but lets take it bit by bit:
- First, we import the express.js components we'll need using node.js' import syntax.
- We then instantiate our express server with `express()` - the server is just an object! We store it in the `app` variable.
   - We also store our port as a variable, just to avoid making [magic numbers](https://wiki.c2.com/?MagicNumber).
- Next, I'll skip ahead to explain something. The server is manipulated by calling methods on the `app` variable. `app.listen()` launches the server with the given configuration. 
   - This method takes in two things: a port, and a callback - a function to call when the server is properly set-up. Passing functions as variables like this is something you'll see very often in JavaScript/TypeScript. The special syntax used here is called an **arrow function**, and is used to quickly define a function without the full `function() { }` syntax. Arrow functions work like this:
   ```js
   (parameter1, parameter2) => {
      // function body code
   }
   ``` 
   Note that you dont specify return types when creating an arrow function. Just return the thing in the body!
- Now that we understand arrow functions, let's go back - the `app.get()` function is used to define an endpoint on our server.
   - We call `app.get()` to specify a `GET` request endpoint. To specify a `POST` endpoint instead, you would do `app.post()`, for example.
   - `app.get()` takes 2 parameters:
      - First, we take the endpoint. This is the path on the server's URL that should be called to access this endpoint. In our case, it's `/`, meaning the base of our server (`localhost:3000/`).
      - The second is the handler - a function specifying what the server should do with requests to this endpoint. The handler function must take in two parameters: a `Request` object and a `Response` object. These let you interact with the HTTP request sent to the server and the HTTP response you will send respectively.
        - In our `app.get()`, we ignore the `req` `Request` for now, and only work with a the response object. `re.send()` sends the final response ot the request back to whomever made the request. In our case, we just say hello!

With that all set up, you should now be able to build and run your app:
```sh
npm run build
npm run serve

# Alternatively, just do:
npm run start
```
These are using the shortcuts we set up in our `package.json` earlier. Here's what they do:
- `npm run build` just runs `tsc`, the typescript compiler. This will compile our TypeScript into JavaScript, and place it in the `dist/` folder.
- `npm run serve` takes the compiled JavaScript and executes this
- Alternatively, `npm run start` is a shortcut to do both of these quickly, useful during development.

After doing the above in the terminal, you should see some output like this:
```
> todo-list-backend@1.0.0 serve
> node dist/index.js

Server running at http://localhost:3000
```

This means the server is now running on our local machine, at port 3000. If we navigate to `http://localhost:3000`, the root of our API, we should be able to see the reply we specified!

Now, lets extend our application a bit. Replace the code in `index.ts` with the following:
```ts
import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// State (count the number of requests)
let count = 0;

// When someone makes a request to http://localhost:3000/, run this code, and give this reply
app.get('/', (req: Request, res: Response) => {
    res
    .setHeader('Access-Control-Allow-Origin', '*')
    .status(200)
    .send('Hello, TypeScript Express!');
});

app.get("/ping",  (req: Request, res: Response) => {
    count++;
    
    let responseContent = {
        message: "pong",
        count: count,
    };
    
    res
    .setHeader('Access-Control-Allow-Origin', '*')
    .status(200)
    .json(responseContent);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
```

We've done 3 main things here.
- First, we added the `.setHeader()` and `.status()` parts to our responses. The first deals with CORS (don't worry about this for now) and the second sets the status code of our reply to 200 (meaning OK) explicitly. Status codes are a way for the server to quickly tell the client how a HTTP request went - for example, 404 means the thing requested could not be found.
- Next, we added another `app.get()` route, at `/ping`. This means whenever `http://localhost:3000/ping` is accessed, this code will be run to produce a response.
  - Instead of calling `.send()` in this handler, we call `.json()`, which lets us send our reponse as a JSON object, standard for APIs.
- We also added a variable `count` at the base of our program. Inside the `/ping` handler, we return the value of this count in the JSON. We also increment it during the handler, so every time a request to the endpoint is made, the count value will increase by 1!

Try running the server again (if the old one is still running, exit it by pressing ctrl+C in the terminal). If you go to `http://localhost:3000/ping`, you should see a JSON response. Every time you refresh, you should see the `count` field in the response increase!

And that's it! Your simple backend is done.

### Frontend - SvelteKit

Svelte itself is the tool we can use to write frontend web pages. For a fully-fledged web application that includes a server and many extra features, we use [SvelteKit](https://kit.svelte.dev/docs/introduction), fully-fledged webapp development framework for Svelte.

We can create a new sveltekit project easily using NPM from the terminal like this:
```sh
npm create svelte@latest todo-list-frontend
```
Running this command will give you an interactive setup tool. Choose the following options:
- *Which Svelte app template?* - **Skeleton project**
- *Add type checking with TypeScript?* - **Yes, using TypeScript syntax**
- *Select additional options (use arrow keys/space bar)* - **Check (with space):**
 - **Add ESLint for code linting**
 - **Add Prettier for code formatting**
 
If you mess anything up, just delete all the files created in your local folder.

This will create a `todolist-frontend` (or whatever you named it) folder with the basis of your app.

From here, navigate into the app directory, install the dependencies (it only defines them when you run the previous step):
```sh
cd todolist-frontend
npm install
```

Once this is done, you can run your app in test mode:
```sh
npm run dev
```

Running this will host your webapp on your PC, probably at [`http://localhost:5173/`](http://localhost:5173/). Navigate there to see it in action! You should see a big "Welcome to SvelteKit" header and some body text.

Now we'll write the "ping" part of our "ping-pong" app on this page.

Open up your favourite editor ([VSCode](https://vscode.dev/) if you don't have one) and open the `todolist-frontend` folder. Now, open up the `src/routes/+page.svelte` file. It should look like this:
```html
<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
```

In SvelteKit, the `src/routes` folder defines pages in your website. For example, the code defining the page at `www.yoursite.com/beans` would be stored in the file `src/routes/beans/+page.svelte`. Since the `src/routes/+page.svelte` file is in the `routes` folder itself, it defines the page we see when we navigate to the base of the website.

First, we will add some code to the frontend that will contact the backend. Add the following to the top of your `src/routes/+page.svelte` file:
```html
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
```

There's a log going on here, but lets go through it step by step.
- The `<script lang="ts">` tag at the beginning denotes that we are writing TypeScript code. It is Svelte convention to put all your JavaScript/TypeScript in a `<script>` tag at the top.
- First, `let pingResponseMessage: string` creates a variable called `pingResponseMessage`, which we use to store the result of contacting the backend. The default value of the variable is `undefined`. All the same goes for `pingResponseCount`
- Then, the `async function ping()` and following lines create a function called `ping()`. First, this function uses `fetch` to make a GET request to the backend, then takes the JSON content of the backend response, and sets the `pingResponseMessage` variable to the `message` value in the response.

Basically, we make a request to the backend, and store the reply!

Now that we have our backend request, lets make a frontend to show it running. Replace the existing HTML in `src/routes/+page.svelte` with the following:
```html
<h1>POGGERS Ping Pong</h1>

<button on:click={ping}>Do Ping</button>

{#if pingResponseMessage != undefined}
    <p>The ping response message was: {pingResponseMessage}</p>
    <p>The ping response count was: {pingResponseCount}</p>
{/if}
```

Let's break this down too:
- `<h1>POGGERS Ping Pong</h1>` is just basic HTML, and shows a relevant title.
- `<button on:click={ping}>Do Ping</button>` creates a button on the web page. The button will say "Do Ping".
 - We give the button a special parameter, `on:click={ping}`. As a rule of thumb, anything with curly braces ('`{`', '`}`') is Svelte-specific stuff. Here, we are saying: "When the button is clicked, run the `ping` function defined at the top".
- Finally, the longest bit:
 - `{#if pingResponseMessage != undefined}` is again Svelte-specific. The `{#if <condition>}` and `{/if}` statements mean that any HTML between them (in this case two lines) will only be shown if the condition is true. In this case, if the `pingResponseMessage` gets a different value than its initial one.
 - The next two `<p>` lines then simply display the values of `pingResponseMessage` and `pingResponseCount`.

All together, your `src/routes/+page.svelte` should look like this:

```html
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
```

And that's it! If your backend is running on `https://localhost:8081`, you should not be able to ping the backend and see the response.
