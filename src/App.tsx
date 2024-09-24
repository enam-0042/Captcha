import { RouterProvider } from "react-router-dom";
import router from "./routes";

function App() {
  return (
    <div className="h-screen w-screen bg-[#E5E5E5] flex justify-center items-center ">
      <div className="py-20 px-32 bg-[#03285D]">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
