import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* FIX #4: duration:3000 + proper reverseOrder so toasts auto-dismiss */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 9999,
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 500,
          },
          success: {
            duration: 3000,
            iconTheme: { primary: "#6366f1", secondary: "#fff" },
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
