import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePocket } from "../context/PocketContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Alert from "../components/Alert";
import { getErrorMessage } from "../utils/errors";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = usePocket();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            to="/"
            className="block text-center text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
          >
            ScottyStack
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {error && <Alert type="error">{error}</Alert>}

          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              rounded="top"
              required
            />
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              rounded="bottom"
              required
            />
          </div>

          <Button type="submit" loading={loading}>
            Sign in
          </Button>

          <div className="text-center">
            <Link
              to="/register"
              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
