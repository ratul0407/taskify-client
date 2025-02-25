import { Droppable, Draggable } from "@hello-pangea/dnd";
import Task from "../task/Task";
import PropTypes from "prop-types";

function Todo({ todos }) {
  return (
    <Droppable droppableId="todos">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-base-100 card w-84 rounded-lg p-8 space-y-4"
        >
          <h3 className="text-xl font-bold">To do</h3>
          <div className="space-y-3">
            {todos.map((todo, index) => (
              <Draggable key={todo._id} draggableId={todo._id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Task
                      todo={todo}
                      handleDelete={() => {}}
                      handleEdit={() => {}}
                      handleSave={() => {}}
                      editingId={null}
                      editedContent=""
                      setEditedContent={() => {}}
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
