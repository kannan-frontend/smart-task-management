import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./context/AuthContext";
import "./services/firebase";
import './index.css'
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <AuthProvider>
      <Toaster position="top-right" toastOptions={{
              style: {
                zIndex: 9999,
              },
            }} />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
