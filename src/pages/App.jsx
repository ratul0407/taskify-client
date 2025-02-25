import { DragDropContext } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import useAuth from "../hooks/useAuth";
import Category from "../components/categories/Category";

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
    socket.on("task-deleted", (deletedTask) => {
      setItems((prevTodos) => {
        return prevTodos.filter((todo) => todo._id !== deletedTask._id);
      });
    });

    return () => {
      socket.off("item-deleted");
    };
  }, []);
  useEffect(() => {
    socket.on("updated-tasks", (task) => {
      setItems((prevTodos) => {
        return prevTodos.map((todo) => (todo._id === task._id ? task : todo));
      });
    });

    return () => {
      socket.off("items-updated");
    };
  }, [user?.email]);

  useEffect(() => {
    socket.on("reordered-tasks", ({ updatedTasks }) => {
      setItems(updatedTasks);
    });

    return () => {
      socket.off("reordered-tasks");
    };
  }, [user?.email]);
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dropped in the same column
    if (source.droppableId === destination.droppableId) {
      // Filter tasks by the current column
      const columnTasks = items.filter(
        (item) => item.category === source.droppableId
      );

      // Reorder tasks within the column
      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);

      // Update order property for tasks in the column
      const updatedColumnTasks = columnTasks.map((task, index) => ({
        ...task,
        order: index + 1,
      }));

      // Merge updated tasks back into the main items array
      const newItems = items.map((item) => {
        if (item.category === source.droppableId) {
          return (
            updatedColumnTasks.find((task) => task._id === item._id) || item
          );
        }
        return item;
      });

      setItems(newItems);
      socket.emit("reorder-items", {
        updatedItems: newItems,
        email: user?.email,
      });
    } else {
      // If dropped in a different column
      const task = items.find((item) => item._id === result.draggableId);
      const updatedTask = { ...task, category: destination.droppableId };

      // Remove task from source column
      const newSourceItems = items.filter((item) => item._id !== task._id);

      // Add task to destination column
      const newDestinationItems = [...newSourceItems, updatedTask];

      // Recalculate order for tasks in the destination column
      const destinationColumnTasks = newDestinationItems
        .filter((item) => item.category === destination.droppableId)
        .map((item, index) => ({
          ...item,
          order: index + 1,
        }));

      // Merge updated tasks back into the main items array
      const finalItems = newDestinationItems.map((item) => {
        if (item.category === destination.droppableId) {
          return (
            destinationColumnTasks.find((task) => task._id === item._id) || item
          );
        }
        return item;
      });

      setItems(finalItems);
      socket.emit("update-task-category", updatedTask);
    }
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  const todos = sortedItems.filter((item) => item.category === "todos");
  const inProgress = sortedItems.filter(
    (item) => item.category === "in-progress"
  );
  const done = sortedItems.filter((item) => item.category === "done");

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col pt-10 px-4 md:px-10 sm:flex-row gap-8">
          <Category tasks={todos} id="todos" title="To do" />
          <Category tasks={inProgress} id="in-progress" title="In Progress" />
          <Category tasks={done} id="done" title="Done" />
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
