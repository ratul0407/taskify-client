import PropTypes from "prop-types";
import deleteIcon from "../../assets/delete.png";
function Task({
  todo,
  handleSave,
  setEditedContent,
  editingId,
  editedContent,
  handleDelete,
  handleEdit,
}) {
  return (
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
  );
}

export default Task;

Task.propTypes = {
  todo: PropTypes.object,
  handleDelete: PropTypes.func,
  handleSave: PropTypes.func,
  handleEdit: PropTypes.func,
  editedContent: PropTypes.string,
  editingId: PropTypes.string,
  setEditedContent: PropTypes.func,
};
