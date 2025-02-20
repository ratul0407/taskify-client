import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Outlet } from "react-router-dom";

function Root() {
  console.log("This is the's root folder");
  const auth = useContext(AuthContext);
  console.log(auth);
  return (
    <div>
      <h3>THis is the root folder</h3>
      <Outlet />
      <div></div>
    </div>
  );
}

export default Root;
