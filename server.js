const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const app = express();

app.use(express.json());

const PORT = 3000;
// ==========================================
// SWAGGER CONFIGURATION
// ==========================================

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task CRUD API",
            version: "1.0.0",
            description: "A simple in-memory Task CRUD API"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==========================================
// IN-MEMORY TASK LIST
// ==========================================

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

// ==========================================
// ROOT ENDPOINT
// ==========================================

app.get("/", (req, res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

// ==========================================
// HEALTH ENDPOINT
// ==========================================

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// ==========================================
// GET ALL TASKS
// GET /tasks
// ==========================================

app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// ==========================================
// GET ONE TASK
// GET /tasks/:id
// ==========================================

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

// ==========================================
// CREATE A NEW TASK
// POST /tasks
// ==========================================

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
        id: tasks.length > 0
            ? Math.max(...tasks.map(task => task.id)) + 1
            : 1,
        title: title.trim(),
        done: false
    };

    // Add task to array
    tasks.push(newTask);

    // Return created task
    res.status(201).json(newTask);
});

// ==========================================
// UPDATE A TASK
// PUT /tasks/:id
// ==========================================

app.put("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, done } = req.body;

    // Find task
    const task = tasks.find(task => task.id === id);

    // Check if task exists
    if (!task) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    // Validate title
    if (!title || typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({
            error: "Title is required and cannot be empty"
        });
    }

    // Update title
    task.title = title.trim();

    // Update done only if it is a boolean
    if (typeof done === "boolean") {
        task.done = done;
    }

    // Return updated task
    res.status(200).json(task);
});

// ==========================================
// DELETE A TASK
// DELETE /tasks/:id
// ==========================================

app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    // Find task index
    const taskIndex = tasks.findIndex(task => task.id === id);

    // Check if task exists
    if (taskIndex === -1) {
        return res.status(404).json({
            error: `Task ${id} not found`
        });
    }

    // Delete task
    tasks.splice(taskIndex, 1);

    // Successful deletion
    res.status(204).send();
});

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});