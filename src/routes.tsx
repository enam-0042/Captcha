import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Verification from "./pages/Verification";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/verification",
    element: <Verification />,
  },
]);

export default router;
