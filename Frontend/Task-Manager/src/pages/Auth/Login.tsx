import { useState, type FormEvent } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import axios from "axios";
import { useUserContext } from "../../hooks/useUserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useUserContext();
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter the password.");
      setIsLoading(false);
      return;
    }

    setError("");

    // Login API Call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-container">
        <div className="mb-8">
          <h3 className="auth-heading">Welcome Back</h3>
          <p className="auth-subheading">Please enter your details to log in</p>
          <div className="w-12 h-1 gradient-bg rounded-full mt-4"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            placeholder="Enter your email"
          />
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Enter your password"
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="button-gradient relative"
              disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                  <span className="opacity-0">LOGIN</span>
                </>
              ) : (
                "LOGIN"
              )}
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
