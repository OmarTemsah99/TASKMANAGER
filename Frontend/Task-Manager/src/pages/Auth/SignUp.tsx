import { useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/ui/ProfilePhotoSelector";
import Input from "../../components/ui/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUserContext } from "../../hooks/useUserContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useUserContext();
  const navigate = useNavigate();

  // Handle SignUp Form Submit
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter full name.");
      setIsLoading(false);
      return;
    }

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

    // SignUp API Call
    try {
      // Handle profile picture upload if provided
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.data.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
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
        setError(err.response?.data?.message || "Registration failed.");
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
          <h3 className="auth-heading">Create an Account</h3>
          <p className="auth-subheading">
            Join us today by entering your details below.
          </p>
          <div className="w-12 h-1 gradient-bg rounded-full mt-4"></div>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6" noValidate>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Enter your name"
              type="text"
            />

            <Input
              label="Email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Enter your email"
              type="text"
            />

            <Input
              label="Password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Enter your password"
              type="password"
            />

            <Input
              label="Admin Invite Token"
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              placeholder="Admin Code (Optional)"
              type="text"
            />
          </div>

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
                  <span className="opacity-0">SIGN UP</span>
                </>
              ) : (
                "SIGN UP"
              )}
            </button>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="auth-link">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
