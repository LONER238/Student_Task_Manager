const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

router.get("/", async (req, res) => {
try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
} catch (error) {
    res.status(500).json({
    message: "Failed to get tasks",
    error: error.message
    });
}
});

router.post("/", async (req, res) => {
try {
    const { title, description } = req.body;

    if (!title) {
    return res.status(400).json({
        message: "Task title is required"
    });
    }

    const newTask = new Task({
    title,
    description
    });

    const savedTask = await newTask.save();

    res.status(201).json(savedTask);
} catch (error) {
    res.status(500).json({
    message: "Failed to create task",
    error: error.message
    });
}
});

router.put("/:id", async (req, res) => {
try {
    const { title, description, completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    {
        title,
        description,
        completed
    },
    {
        new: true,
        runValidators: true
    }
    );

    if (!updatedTask) {
    return res.status(404).json({
        message: "Task not found"
    });
    }

    res.status(200).json(updatedTask);
} catch (error) {
    res.status(500).json({
    message: "Failed to update task",
    error: error.message
    });
}
});

router.delete("/:id", async (req, res) => {
try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
    return res.status(404).json({
        message: "Task not found"
    });
    }

    res.status(200).json({
    message: "Task deleted successfully"
    });
} catch (error) {
    res.status(500).json({
    message: "Failed to delete task",
    error: error.message
    });
}
});

module.exports = router;