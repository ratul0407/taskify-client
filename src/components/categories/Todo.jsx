import axios from "axios";
import useAuth from "../../hooks/useAuth";

function Todo() {
  const { logOut } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const todo = form.todo.value;
    if (!todo.trim()) return;
    axios.post(`${import.meta.env.VITE_API_URL}/tasks`, {
      title: todo,
      timestamp: Date.now(),
      category: "todo",
    });
  };
  return (
    <div className="bg-slate-200 w-84 rounded-lg  p-8 space-y-4">
      <h3 className=" text-xl font-bold">To do</h3>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            name="todo"
            className="px-4 py-2 border-2 border-slate-500 bg-slate-200"
            placeholder="Add a todo"
          />
          <button className="px-4 py-2 bg-slate-300 rounded-lg">Add</button>
        </div>
      </form>
      <button onClick={logOut}>Log out</button>
    </div>
  );
}

export default Todo;
