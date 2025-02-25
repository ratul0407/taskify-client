import Todo from "../components/categories/Todo";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";
import { useEffect } from "react";
import { socket } from "../utils/socket";
import useAuth from "../hooks/useAuth";
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
          return [...prevItems, task]; // Add only if it's new
        }
        return prevItems; // If duplicate, return the existing list
      });
    });
  }, []);

  console.log(items);
  useEffect(() => {
    socket.on("items-updated"),
      (updatedItems) => {
        setItems(updatedItems);
      };

    return () => {
      socket.off("items updated");
    };
  });
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    // Update order property
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setItems(updatedItems);

    // Emit the new order to the server
    socket.emit("reorder items", updatedItems);
  };
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex pt-10 px-10">
          <Todo todos={items} setTodos={setItems} />
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
