const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const taskRoutes = require("./routes/taskRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {res.send("Student Task Manager Backend is running");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });
})
.catch((error) => {
    console.error("MongoDB connection failed:", error.message);
});