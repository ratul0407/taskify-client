import { Draggable } from "@hello-pangea/dnd";
import { Droppable } from "@hello-pangea/dnd";
import Task from "../task/Task";
import PropTypes from "prop-types";
import { socket } from "../../utils/socket";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useState } from "react";

function Category({ tasks, id, title }) {
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

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
      order: tasks.length + 1,
    };

    socket.emit("task-creation", newTask);
    form.reset();
  };
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
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-base-100 card w-84 rounded-lg p-8 space-y-4 cursor-grab "
        >
          <h3 className="text-xl font-bold">{title}</h3>
          <form onSubmit={(e) => handleSubmit(e, id)}>
            <div className="flex gap-2">
              <input
                name="task"
                className="input input-bordered"
                placeholder="Add a todo"
                maxLength={50}
              />
              <button className="btn">Add</button>
            </div>
          </form>
          <div className="space-y-3">
            {tasks?.map((todo, index) => (
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

export default Category;
Category.propTypes = {
  tasks: PropTypes.array,
  id: PropTypes.string,
  title: PropTypes.string,
};
