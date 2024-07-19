To run this project, you will need your own MongoDB account and cluster. When signing up on the website you will get a free shared M0 Cluster0 for testing. In the Security Quickstart section, you should take note of the database username and password for the connection string. You will obtain your connection string through the Connect button on the Database screen. This will be in a format of:

```
mongodb+srv://<username>:<password>@cluster0.jq5llig.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

In `todo-list-backend/src`, create a file with the name `.env`. This file stores environment variables. The `.env` file should contain the line:

```
MONGODB_URI=<connection_string>
```

