import { useState, type FormEvent } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  // Handle Login Form Submit
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    let hasErrors = false;

    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required",
      }));
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      hasErrors = true;
    }

    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Password is required",
      }));
      hasErrors = true;
    } else if (password.length < 3) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 3 characters",
      }));
      hasErrors = true;
    }

    if (hasErrors) return;

    // Login API Call
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <h3 className="text-2xl font-medium text-white">Welcome Back</h3>
          <p className="text-gray-400 mt-2">
            Please enter your details to log in
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5" noValidate>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                setErrors((prev) => {
                  const { email, ...rest } = prev;
                  return rest;
                });
              }
            }}
            placeholder="Enter your email"
            error={errors.email}
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => {
                  const { password, ...rest } = prev;
                  return rest;
                });
              }
            }}
            placeholder="Enter your password"
            error={errors.password}
          />

          <div>
            <button
              type="submit"
              className="w-full h-12 px-6 text-white font-medium 
                bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 
                hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600
                rounded-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1E1145]
                shadow-lg shadow-purple-500/20
                disabled:opacity-50 disabled:cursor-not-allowed">
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
