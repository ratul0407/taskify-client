import { io } from "socket.io-client";
import Todo from "../components/categories/Todo";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { socket } from "../utils/socket";
function App() {
  const [items, setItems] = useState([]);

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
    const { source, destination } = result;
    const newItems = Array.from(items);
    const movedItem = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, movedItem);

    setItems(newItems);

    socket.emit("reorder items", newItems);
  };
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex pt-10 px-10">
          <Todo />
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
