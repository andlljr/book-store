const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const env = require("dotenv").config();
const cors = require("cors"); // Import the cors middleware


const app = express();

app.use(cors());

const client = new pg.Client({
    host: process.env.RDS_HOSTNAME,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB_NAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD
})

client.connect(function(err){
    if(err){
        console.error('error connecting: ' + err);
    }
    else{
        console.log("Connected to database.");
    }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    // Query the database for the user with the provided email and password
    const query = 'SELECT * FROM "user" WHERE email = $1 AND password = $2';
    const values = [email, password];

    client.query(query, values, (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "An error occurred while logging in." });
        }

        // Check if a user with the provided credentials was found
        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password." });
        }

        // User is authenticated
        const user = result.rows[0];
        return res.status(200).json({ message: "Login successful.", user });
    });
});

// Registration route
app.post("/register", (req, res) => {
    const { name, email, telephone, password } = req.body;

    // Check if required fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
    }

    console.log(req.body);

    // Check if the email is already in use
    const emailCheckQuery = 'SELECT * FROM "user" WHERE email = $1';
    const emailCheckValues = [email];

    client.query(emailCheckQuery, emailCheckValues, (emailCheckErr, emailCheckResult) => {
        if (emailCheckErr) {
            console.error("Error executing email check query:", emailCheckErr);
            return res.status(500).json({ error: "An error occurred while checking email availability." });
        }

        if (emailCheckResult.rows.length > 0) {
            return res.status(400).json({ error: "Email is already in use." });
        }

        // Insert the new user into the database
        const insertQuery = 'INSERT INTO "user" (name, email, telephone, password) VALUES ($1, $2, $3, $4) RETURNING id';
        const insertValues = [name, email, telephone, password];

        client.query(insertQuery, insertValues, (insertErr, insertResult) => {
            if (insertErr) {
                console.error("Error executing insert query:", insertErr);
                return res.status(500).json({ error: "An error occurred while registering." });
            }

            const userId = insertResult.rows[0].id;
            return res.status(201).json({ message: "Registration successful.", userId });
        });
    });
});

// Edit user information route
app.put("/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const { name, email, telephone, password } = req.body;

        // Check if user with the provided ID exists
        const userCheckQuery = 'SELECT * FROM "user" WHERE id = $1';
        const userCheckValues = [userId];

        const userCheckResult = await client.query(userCheckQuery, userCheckValues);

        if (userCheckResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        // Construct the update query based on provided fields
        const updateFields = [];
        const updateValues = [];
        let updateIndex = 1;

        if (name) {
            updateFields.push(`name = $${updateIndex}`);
            updateValues.push(name);
            updateIndex++;
        }

        if (email) {
            updateFields.push(`email = $${updateIndex}`);
            updateValues.push(email);
            updateIndex++;
        }

        if (telephone) {
            updateFields.push(`telephone = $${updateIndex}`);
            updateValues.push(telephone);
            updateIndex++;
        }

        if (password) {
            // Assuming your password hashing logic is handled elsewhere
            updateFields.push(`password = $${updateIndex}`);
            updateValues.push(password);
            updateIndex++;
        }

        const updateQuery = `UPDATE "user" SET ${updateFields.join(", ")} WHERE id = $${updateIndex}`;
        updateValues.push(userId);

        await client.query(updateQuery, updateValues);

        return res.status(200).json({ message: "User information updated successfully." });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "An error occurred while updating user information." });
    }
});


app.get("/users/:userId", (req, res) => {
    const userId = req.params.userId;

    // Query the database to get user information
    const getUserQuery = "SELECT * FROM public.\"user\" WHERE id = $1";
    const getUserValues = [userId];

    client.query(getUserQuery, getUserValues, (getUserErr, getUserResult) => {
        if (getUserErr) {
            console.error("Error executing user retrieval query:", getUserErr);
            return res.status(500).json({ error: "An error occurred while retrieving user information." });
        }

        if (getUserResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = getUserResult.rows[0];
        return res.status(200).json({ user });
    });
});

app.delete("/users/:userId", (req, res) => {
    const userId = req.params.userId;

    // Query the database to delete the user
    const deleteUserQuery = "DELETE FROM public.\"user\" WHERE id = $1";
    const deleteUserValues = [userId];

    client.query(deleteUserQuery, deleteUserValues, (deleteUserErr, deleteUserResult) => {
        if (deleteUserErr) {
            console.error("Error executing user deletion query:", deleteUserErr);
            return res.status(500).json({ error: "An error occurred while deleting the user." });
        }

        if (deleteUserResult.rowCount === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        return res.status(200).json({ message: "User deleted successfully." });
    });
});

app.post("/tasks", (req, res) => {
    const { title, description, status, user_id } = req.body;

    // Check if required fields are provided
    if (!title || !status || !user_id) {
        return res.status(400).json({ error: "Title, status, and user ID are required." });
    }

    // Insert the new task into the database
    const insertTaskQuery = "INSERT INTO task (title, description, status, user_id) VALUES ($1, $2, $3, $4) RETURNING id";
    const insertTaskValues = [title, description, status, user_id];

    client.query(insertTaskQuery, insertTaskValues, (insertTaskErr, insertTaskResult) => {
        if (insertTaskErr) {
            console.error("Error executing insert task query:", insertTaskErr);
            return res.status(500).json({ error: "An error occurred while adding the task." });
        }

        const taskId = insertTaskResult.rows[0].id;
        return res.status(201).json({ message: "Task added successfully.", taskId });
    });
});

app.put("/tasks/:taskId", (req, res) => {
    const taskId = req.params.taskId;
    const { title, description, status } = req.body;

    // Update task information in the database
    const updateTaskQuery = "UPDATE task SET title = $1, description = $2, status = $3 WHERE id = $4";
    const updateTaskValues = [title, description, status, taskId];

    client.query(updateTaskQuery, updateTaskValues, (updateTaskErr, updateTaskResult) => {
        if (updateTaskErr) {
            console.error("Error executing update task query:", updateTaskErr);
            return res.status(500).json({ error: "An error occurred while updating the task." });
        }

        return res.status(200).json({ message: "Task updated successfully." });
    });
});

app.delete("/tasks/:taskId", (req, res) => {
    const taskId = req.params.taskId;

    // Delete the task from the database
    const deleteTaskQuery = "DELETE FROM task WHERE id = $1";
    const deleteTaskValues = [taskId];

    client.query(deleteTaskQuery, deleteTaskValues, (deleteTaskErr, deleteTaskResult) => {
        if (deleteTaskErr) {
            console.error("Error executing delete task query:", deleteTaskErr);
            return res.status(500).json({ error: "An error occurred while deleting the task." });
        }

        if (deleteTaskResult.rowCount === 0) {
            return res.status(404).json({ error: "Task not found." });
        }

        return res.status(200).json({ message: "Task deleted successfully." });
    });
});

app.get("/tasks/status/:status", (req, res) => {
    const status = req.params.status;

    // Retrieve tasks from the database based on status
    const getTasksByStatusQuery = "SELECT * FROM task WHERE status = $1";
    const getTasksByStatusValues = [status];

    client.query(getTasksByStatusQuery, getTasksByStatusValues, (getTasksByStatusErr, getTasksByStatusResult) => {
        if (getTasksByStatusErr) {
            console.error("Error executing get tasks by status query:", getTasksByStatusErr);
            return res.status(500).json({ error: "An error occurred while retrieving tasks by status." });
        }

        return res.status(200).json({ tasks: getTasksByStatusResult.rows });
    });
});

app.get("/tasks/:taskId", (req, res) => {
    const taskId = req.params.taskId;

    // Query the database to get task information
    const getTaskQuery = "SELECT * FROM task WHERE id = $1";
    const getTaskValues = [taskId];

    client.query(getTaskQuery, getTaskValues, (getTaskErr, getTaskResult) => {
        if (getTaskErr) {
            console.error("Error executing get task query:", getTaskErr);
            return res.status(500).json({ error: "An error occurred while retrieving the task." });
        }

        if (getTaskResult.rows.length === 0) {
            return res.status(404).json({ error: "Task not found." });
        }

        const task = getTaskResult.rows[0];
        return res.status(200).json({ task });
    });
});

// Get all tasks for a specific user route
app.get("/users/:userId/tasks", (req, res) => {
    const userId = req.params.userId;

    // Query the database to get all tasks for the specified user
    const getUserTasksQuery = "SELECT * FROM task WHERE user_id = $1";
    const getUserTasksValues = [userId];

    client.query(getUserTasksQuery, getUserTasksValues, (getUserTasksErr, getUserTasksResult) => {
        if (getUserTasksErr) {
            console.error("Error executing user tasks retrieval query:", getUserTasksErr);
            return res.status(500).json({ error: "An error occurred while retrieving user tasks." });
        }

        return res.status(200).json({ tasks: getUserTasksResult.rows });
    });
});

app.delete("/tasks/user/:userId", (req, res) => {
    const userId = req.params.userId;

    // Check if userId is a valid number
    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID." });
    }

    // Delete all tasks associated with the user ID from the database
    const deleteTasksQuery = "DELETE FROM task WHERE user_id = $1";
    const deleteTasksValues = [userId];

    client.query(deleteTasksQuery, deleteTasksValues, (deleteTasksErr, deleteTasksResult) => {
        if (deleteTasksErr) {
            console.error("Error executing delete tasks query:", deleteTasksErr);
            return res.status(500).json({ error: "An error occurred while deleting tasks." });
        }

        return res.status(200).json({ message: "Tasks deleted successfully." });
    });
});




app.listen(8000, () => {
    console.log("Server is running on port 8000.");
})