import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-800 dark:text-white mt-4">
          Page not found
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
