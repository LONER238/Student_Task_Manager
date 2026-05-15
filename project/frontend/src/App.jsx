import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      setMessage("Failed to load tasks. Please check if backend is running.");
    }
  };

  const addTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setMessage("Please write a task title.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title,
          description
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      setTitle("");
      setDescription("");
      setMessage("Task added successfully.");
      fetchTasks();
    } catch (error) {
      setMessage("Failed to add task.");
    }
  };

  const toggleComplete = async (task) => {
    try {
      const response = await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          completed: !task.completed
        })
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setMessage("Task updated successfully.");
      fetchTasks();
    } catch (error) {
      setMessage("Failed to update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setMessage("Task deleted successfully.");
      fetchTasks();
    } catch (error) {
      setMessage("Failed to delete task.");
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Student Task Manager</h1>

        <p className="subtitle">
          A simple MERN-stack project for managing study tasks.
        </p>

        <form className="task-form" onSubmit={addTask}>
          <input
            type="text"
            placeholder="Write task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <textarea
            placeholder="Write task description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          ></textarea>

          <button type="submit">Add Task</button>
        </form>

        {message && <p className="message">{message}</p>}

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet. Add your first task.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={task.completed ? "task completed" : "task"}
              >
                <div className="task-info">
                  <h2>{task.title}</h2>

                  {task.description && <p>{task.description}</p>}

                  <span>
                    Status: {task.completed ? "Completed" : "Not completed"}
                  </span>
                </div>

                <div className="task-buttons">
                  <button onClick={() => toggleComplete(task)}>
                    {task.completed ? "Undo" : "Complete"}
                  </button>

                  <button
                    className="delete"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;