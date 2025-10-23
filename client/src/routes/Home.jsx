import { Link } from "react-router-dom";
import { usePocket } from "../context/PocketContext";

export default function Home() {
  const { user } = usePocket();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">ScottyStack</h1>
        <p className="text-xl mb-8">React + PocketBase + TailwindCSS</p>
        
        {user ? (
          <Link
            to="/dashboard"
            className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="space-x-4">
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition inline-block"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
