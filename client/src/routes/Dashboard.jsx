import { usePocket } from "../context/PocketContext";
import NavBar from "../components/NavBar";

export default function Dashboard() {
  const { user } = usePocket();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />

      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Welcome to your dashboard!
              </h3>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                You're successfully logged in as{" "}
                <strong className="dark:text-white">{user?.email}</strong>
              </p>
              <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/30">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This is a protected route. Only authenticated users can see
                  this page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
