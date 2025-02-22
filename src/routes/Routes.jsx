import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/Root";
import App from "../pages/App";
import Login from "../pages/Login";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: (
          <PrivateRoute>
            <App />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
