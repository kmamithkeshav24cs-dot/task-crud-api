const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;

// In-memory task list
let tasks = [
    {
        id: 1,
        title: "Learn Node.js",
        done: false
    },
    {
        id: 2,
        title: "Build a REST API",
        done: false
    },
    {
        id: 3,
        title: "Test the API",
        done: true
    }
];

// Stage 1: Root endpoint
app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

// Stage 1: Health endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// Stage 2: Get all tasks
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// Stage 2: Get one task by ID
app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    res.status(200).json(task);
});
// Stage 3: Create a new task
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    // Validate title
    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required and cannot be empty"
        });
    }

    // Create new task
    const newTask = {
        id: tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1,
        title: title.trim(),
        done: false
    };

    // Add task to list
    tasks.push(newTask);

    // Return created task
    res.status(201).json(newTask);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});