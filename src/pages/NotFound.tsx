import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      
      <h1 className="text-6xl font-bold text-indigo-600">404</h1>
      
      <p className="text-xl mt-4 text-gray-700">
        Oops! Page not found
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
      >
        Go to Home
      </button>

    </div>
  );
};

export default NotFound;