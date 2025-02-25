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
    if (!result.destination) return; // Dropped outside the list

    const { source, destination } = result;

    // Reorder the items locally
    const newItems = Array.from(items);
    const [movedItem] = newItems.splice(source.index, 1); // Remove the item from its old position
    newItems.splice(destination.index, 0, movedItem); // Insert the item at its new position

    // Update local state
    setItems(newItems);

    // Emit the new order to the server
    socket.emit("reorder items", newItems);
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
