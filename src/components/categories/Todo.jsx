import { Droppable } from "@hello-pangea/dnd";
import { Draggable } from "@hello-pangea/dnd";
import PropTypes from "prop-types";
import { socket } from "../../utils/socket";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { useEffect } from "react";
import Task from "../task/Task";

function Todo({ todos, setTodos }) {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  console.log(todos);
  // Fetch initial tasks and listen for real-time updates
  useEffect(() => {
    if (!user?.email) return;

    // Fetch initial tasks from server
    socket.emit("get-tasks", user.email);

    // Listen for updated tasks
    socket.on("updatedTasks", (task) => {
      console.log(task);
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => (todo._id === task._id ? task : todo));
      });
    });
    socket.on("task-deleted", (deletedTask) => {
      setTodos((prevTodos) => {
        return prevTodos.filter((todo) => todo._id !== deletedTask._id);
      });
    });

    return () => {
      socket.off("updatedTasks"); // Cleanup listener on unmount
    };
  }, [user?.email]);

  // Add a new todo
  const handleSubmit = (e, category) => {
    e.preventDefault();
    const form = e.target;
    const task = form.task.value.trim();
    if (!task) return;

    const newTask = {
      title: task,
      timestamp: Date.now(),
      category: category,
      addedBy: user?.email,
      order: todos.length + 1,
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
        socket.emit("task-delete", { id });
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
    socket.emit("task-update", { id, title: editedContent, user: user?.email });
    setEditingId(null);
  };

  return (
    <Droppable droppableId="todos">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-base-100 card w-84 rounded-lg p-8 space-y-4"
        >
          <h3 className="text-xl font-bold">To do</h3>
          <form onSubmit={(e) => handleSubmit(e, "todos")}>
            <div className="flex gap-2">
              <input
                name="task"
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
Todo.propTypes = {
  todos: PropTypes.array,
  setTodos: PropTypes.func,
};
