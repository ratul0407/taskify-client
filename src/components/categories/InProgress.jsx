import { Droppable } from "@hello-pangea/dnd";
import PropTypes from "prop-types";
import Task from "../task/Task";
import { Draggable } from "@hello-pangea/dnd";

function InProgress({ inProgress }) {
  return (
    <Droppable droppableId="in-progress">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-base-100 card w-84 rounded-lg p-8 space-y-4"
        >
          <h3 className="text-xl font-bold">InProgress</h3>
          <div className="space-y-3">
            {inProgress.map((todo, index) => (
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

export default InProgress;
InProgress.propTypes = {
  inProgress: PropTypes.array,
  setInProgress: PropTypes.func,
};
