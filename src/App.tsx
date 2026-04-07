import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        style: {
          zIndex: 9999,
        },
      }} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;