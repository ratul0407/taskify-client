import { io } from "socket.io-client";
import Todo from "../components/categories/Todo";
import { DragDropContext } from "@hello-pangea/dnd";
function App() {
  const onDragEnd = (result) => {
    console.log(result);
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
