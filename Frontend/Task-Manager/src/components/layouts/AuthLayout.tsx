import type { ReactNode } from "react";
import UI_IMG from "../../assets/images/AuthLogin.png";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[#1E1145] relative overflow-hidden">
      {/* Background image for entire layout */}
      <div className="absolute inset-0 bg-[url('/bg-img2.webp')] bg-cover bg-center opacity-10 pointer-events-none z-0" />

      {/* Content overlay */}
      <div className="flex flex-1 relative z-10 w-full">
        {/* Left section with form */}
        <div className="w-full lg:w-1/2 flex flex-col px-6 md:px-12 py-8">
          <h2 className="text-xl font-bold text-blue-400">
            Task Manager WebApp
          </h2>
          <div className="flex-1 flex items-center">
            <div className="w-full">{children}</div>
          </div>
        </div>

        {/* Right section with illustration */}
        <div className="hidden lg:flex w-1/2 items-center justify-center">
          <img
            src={UI_IMG}
            className="w-3/4 drop-shadow-2xl"
            alt="Task Management Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
