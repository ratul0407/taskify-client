import { Outlet } from "react-router-dom";

function Root() {
  return (
    <div className="bg-slate-100 min-h-screen">
      <Outlet />
    </div>
  );
}

export default Root;
