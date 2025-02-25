import Todo from "../components/categories/Todo";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import useAuth from "../hooks/useAuth";
import InProgress from "../components/categories/InProgress";

function App() {
  const [items, setItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;
    socket.emit("get-tasks", user.email);
    socket.on("userTasks", (tasks) => {
      setItems(tasks);
    });
    socket.on("newTask", (task) => {
      setItems((prevItems) => {
        // Check if task already exists
        if (!prevItems.some((item) => item._id === task._id)) {
          return [...prevItems, task];
        }
        return prevItems;
      });
    });
  }, [user?.email]);

  useEffect(() => {
    socket.on("items-updated", (updatedItems) => {
      setItems(updatedItems);
    });

    return () => {
      socket.off("items-updated");
    };
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dropped in the same column
    if (source.droppableId === destination.droppableId) {
      const reorderedItems = Array.from(items);
      const [movedItem] = reorderedItems.splice(source.index, 1);
      reorderedItems.splice(destination.index, 0, movedItem);

      // Update order property
      const updatedItems = reorderedItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setItems(updatedItems);
      socket.emit("reorder-items", updatedItems);
    } else {
      // If dropped in a different column
      const task = items.find((item) => item._id === result.draggableId);
      const updatedTask = { ...task, category: destination.droppableId };

      // Remove task from source column
      const newSourceItems = items.filter((item) => item._id !== task._id);

      // Add task to destination column
      const newDestinationItems = [...newSourceItems, updatedTask];

      setItems(newDestinationItems);
      socket.emit("update-task-category", updatedTask);
    }
  };

  // Filter tasks by category
  const todos = items.filter((item) => item.category === "todos");
  const inProgress = items.filter((item) => item.category === "in-progress");

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex pt-10 px-10 gap-8">
          <Todo todos={todos} setTodos={setItems} />
          <InProgress inProgress={inProgress} setInProgress={setItems} />
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
