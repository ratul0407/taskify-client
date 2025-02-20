import { createBrowserRouter } from "react-router-dom";
import Root from "../layouts/Root";
import App from "../pages/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <App />,
      },
    ],
  },
]);

export default router;
