import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Outlet } from "react-router-dom";

function Root() {
  console.log("This is the's root folder");
  const auth = useContext(AuthContext);
  console.log(auth);
  return (
    <div className="bg-slate-100 min-h-screen">
      <Outlet />
    </div>
  );
}

export default Root;
