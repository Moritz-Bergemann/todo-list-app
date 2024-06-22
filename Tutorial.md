# The To-Do List App

A to-do list app is a great simple application for learning the basics of front-and-backend. It's got the key fundamentals of an application - a simple user interface, and a program state that must be managed over time.

## Communication

The most complicated part of this exercise might be designing the communication between your frontend and your backend, so let's start here! The frontend will display the app to the user, while the backend will store all of the program's logic (in this case, mainly just storing information about to-do items).

However, while we can write applications to do both of these separately, a hard part is getting them to work together. We do this using an API (Application Programming Interface), which is a part of a program that other programs can talk to to access its features. You can think of an API a lot like a program providing some functions/methdods that other applications can call. In our case, our backend will provide the API for accessing and manipulating to-do items, which our frontend will use to display and modify them.

Our API will use HTTP for communication - the same protocol used to access just about anything on the web! HTTP follows a request-response pattern. That is, one device makes a HTTP request to a service, and the service replies with the response. The requests are made to URL endpoints - for example, `www.google.com` or `localhost` (the endpoint for your own computer). 

For our to-do list app, we can start by providing two simple utilities with our API - retrieving all to-dos, and creating new to-dos. 

### Getting To-Dos
HTTP requests have a request type, which indicates what we would like to do at the endpoint we specify. The most common of these is the `GET` type. `GET` requests imply that we are asking the server to provide us with something. For example, when we make a `GET` request to `www.google.com`, we are asking for the Google homepage data. In HTTP APIs, we use `GET` to retrieve data from the server, such as our to-dos! 

Let's define our to-do retrieval as follows: when anyone makes a `GET` request to the `localhost/todo-item` URL, the server will respond with a list of all to-do items. Simple as that! The server will include to-dos these in a JSON string format (convention for HTTP APIs), stored in what we call the response body. 

So, for example, when we make the request `GET localhost/todo-item`, we might expect a response like:
```json
[
    {
        "id": 1,
        "name": "My first to-do",
        "isChecked": true
    },
    {
        "id": 2,
        "name": "Another to-do",
        "isChecked": false
    }

]
```

### Creating To-Dos
`POST` is the next most common HTTP request type. It implies that we want to *provide* something to the server - usually to create some new data on it. `POST` requests include their own response body, which should contain the data that we would like to add. In our case, we'll say that when you make a `POST` request to `localhost/todo-item` URL that includes the data for a new to-do item, the server will create and save it. It is then convention for the server to include the full created item in the response.

For example, if we make the request `POST localhost/todo-item` with this body:
```json
{
    "name": "A new to-do"
}
```
We might expect the response:
```json
{
    "id": 3,
    "name": "A new to-do",
    "isChecked": false
}
```

### REST APIs
You might have noticed that for our example, both the `GET` and `POST` requests are made to the same `localhost/todo-item` endpoint. Why do we do this, instead of naming our endpoints more specifically, like `localhost/get-todos` and `localhost/create-new-todo`? This is part of a convention known as REST, which is very common in HTTP API programming. The idea behind REST is that the endpoints provided should represent your functionality almost like resources on a website. In our case, we have the 'to-do item' resource, which we can retrieve using `GET` or add to using `POST`. REST recommends using other request types too, such as `DELETE` for removing a specific request, or `PUT` for updating one. If we wanted to create a function for getting a particular to-do, REST convention would be to treat it almost like a page on a website - for example, to retrieve a to-do with ID `123`, the request should be `GET localhost/todo-item/123`.

## The Backend
Our application frontend will responsible for storing our todo items over time, and providing the frontend the ability to retrieve, update, and delete them on request.

For all of the initial setup, please see the initial `todo-list-backend` folder.

Our backend will need the following features:
- Retrieve to-dos
- Create to-dos
- Deleting to-dos
- Marking to-dos as done

We are achieving this using `express.js`, a very simple JavaScript library for creating web APIs. Express revolves around the `express` object, which we can provide functions which it should run when certain HTTP endpoints are hit. For example, if we want to provide all of the to-do items when the user makes a request to `/todo-item`, we can do it like this:

```ts
// Create the express object
const app = express();

app.get("/todo-item", (req: Request, res: Response) => {
	res
        .setHeader("Access-Control-Allow-Origin", "*") // Some security policy stuff
        .status(200) // Set the response code to 200
        .json(todos); // Send the todo-items in the response (encoding them as JSON)
});
```

What we're doing here is a very common JavaScript pattern - the `() => {}` bit is special syntax for defining a function. So, we are effectively passing a function as a parameter to the `app.get()` function. We are telling it, "whenever `/todo-item` is accessed, run this function.

## The Frontend

The frontend of your application is the part that gives your users an interface to your application. This is where you decide what your user will see, and how they interact with your app! In our case, we will be using Svelte, a web framework, to help us build our frontend in the form of a web page.

For all of the initial setup, please see the initial `todo-list-frontend` folder.

Our frontend will need the following features:
- Displaying to-dos
- Creating to-dos
- Deleting to-dos
- Marking to-dos as done

### Displaying to-dos
A good place to start is probably displaying all of the to-dos. To do this, we'll first have to create a function that retrieves to-dos from the backend, which stores all of our state. We do this using the `fetch` function in JavaScript, which makes an HTTP request to a URL you specify. For example, the result of `fetch("google.com")` would be the HTML content of the google homepage. Instead, we're here going to use it to talk to our backend and get the current list of to-do items from the backend. Using HTML to communicate between programs like that is called an API.

Here's what our request could look like (this will need our backend running to work!)

```ts
async function getTodos() {
    todosData = await fetch("https://localhost:5000");

    todos = JSON.parse(todosData);

    return todos;
}
```

In our `+page.svelte`, we can then do a simple display of the items using the `each` expression:
```html
<script>
    let todos: string[];

    // Put the getTodos() function here!
</script>

{#each todos as todo}
    <p>- {todo}</p>
{/each}

<button on:click={onGetTodoButtonClick}>Get Todos</button>
```

This will retrieve all of the todo items when the button is pressed, and then display them!