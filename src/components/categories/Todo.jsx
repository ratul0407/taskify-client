import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import useAuth from "../../hooks/useAuth";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import { Droppable } from "@hello-pangea/dnd";
import Task from "../task/Task";
import { Draggable } from "@hello-pangea/dnd";

// Initialize socket connection
const socket = io(import.meta.env.VITE_API_URL);

function Todo() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  // Fetch initial tasks and listen for real-time updates
  useEffect(() => {
    if (!user?.email) return;

    // Fetch initial tasks from server
    socket.emit("get-tasks", user.email);

    // Listen for updated tasks
    socket.on("updatedTasks", (newTasks) => {
      setTodos(newTasks);
      setLoading(false);
    });

    return () => {
      socket.off("updatedTasks"); // Cleanup listener on unmount
    };
  }, [user?.email]);

  // Add a new todo
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const todo = form.todo.value.trim();
    if (!todo) return;

    const newTask = {
      title: todo,
      timestamp: Date.now(),
      category: "todo",
      addedBy: user?.email,
    };

    socket.emit("task-creation", newTask);
    form.reset();
  };

  // Delete a todo
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit("task-delete", id);
      }
    });
  };

  // Handle editing a todo
  const handleEdit = (id, title) => {
    setEditingId(id);
    setEditedContent(title);
  };

  // Save the edited todo
  const handleSave = (id) => {
    socket.emit("task-update", { id, title: editedContent });
    setEditingId(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Droppable droppableId="todos">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-base-100 card w-84 rounded-lg p-8 space-y-4"
        >
          <h3 className="text-xl font-bold">To do</h3>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                name="todo"
                className="input input-bordered"
                placeholder="Add a todo"
              />
              <button className="btn">Add</button>
            </div>
          </form>
          <div className="space-y-3">
            {todos?.map((todo, index) => (
              <Draggable key={todo._id} draggableId={todo._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task
                      todo={todo}
                      handleDelete={handleDelete}
                      handleEdit={handleEdit}
                      handleSave={handleSave}
                      editingId={editingId}
                      editedContent={editedContent}
                      setEditedContent={setEditedContent}
                    />
                  </div>
                )}
              </Draggable>
            ))}
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default Todo;
