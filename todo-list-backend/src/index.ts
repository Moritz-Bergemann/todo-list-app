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
