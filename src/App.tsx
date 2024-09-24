import { RouterProvider } from "react-router-dom"
import router from "./routes"

function App() {

  return (
    <div className="h-screen w-screen bg-gray-300 flex justify-center items-center ">
    <div className="p-8 bg-blue-700">
      <RouterProvider router={router}  />
      </div>
    </div>
  )
}

export default App
