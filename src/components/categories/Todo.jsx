import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
import deleteIcon from "../../assets/delete.png";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import Swal from "sweetalert2";
import { useState } from "react";

function Todo() {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null); // Track which todo is being edited
  const [editedContent, setEditedContent] = useState(""); // Track the edited content

  // Fetch tasks using React Query
  const {
    data: todos,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["todos", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/tasks?email=${user.email}`
      );
      return data;
    },
    enabled: !!user?.email,
  });

  // Add a new todo
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const todo = form.todo.value.trim();
    if (!todo) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        {
          title: todo,
          timestamp: Date.now(),
          category: "todo",
          addedBy: user?.email,
        }
      );

      if (response.data.insertedId) {
        refetch();
        form.reset();
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Delete a todo
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}/task/${id}`
          );
          if (response.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
            refetch();
          }
        } catch (error) {
          console.error("Error deleting todo:", error);
        }
      }
    });
  };

  // Handle editing a todo
  const handleEdit = (id, title) => {
    setEditingId(id); // Set the todo being edited
    setEditedContent(title); // Set the current content for editing
  };

  // Save the edited todo
  const handleSave = async (id) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/task/${id}`,
        {
          title: editedContent,
        }
      );

      if (response.data.modifiedCount > 0) {
        setEditingId(null); // Exit edit mode
        refetch(); // Refresh the todo list
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Show loading state
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="bg-base-100 card w-84 rounded-lg p-8 space-y-4">
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
        {todos?.map((todo) => (
          <div
            key={todo._id}
            className="bg-slate-100 flex items-center justify-between px-4"
          >
            {editingId === todo._id ? (
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onBlur={() => handleSave(todo._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSave(todo._id);
                  }
                }}
                autoFocus
              />
            ) : (
              <p
                data-tip="double click to edit"
                onDoubleClick={() => handleEdit(todo._id, todo.title)}
                className="bg-slate-100 py-2 rounded-lg tooltip"
              >
                {todo.title}
              </p>
            )}

            <div className="gap-2 flex items-center">
              <button
                onClick={() => handleDelete(todo._id)}
                className="btn btn-ghost tooltip"
                data-tip="delete"
              >
                <img className="h-4 w-4" src={deleteIcon} alt="delete todo" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Todo;
