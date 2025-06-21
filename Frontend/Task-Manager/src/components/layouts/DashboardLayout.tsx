import { type ReactNode } from "react";
import { useUserContext } from "../../hooks/useUserContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

interface DashboardLayoutProps {
  children: ReactNode;
  activeMenu: string;
}

const DashboardLayout = ({ children, activeMenu }: DashboardLayoutProps) => {
  const { user } = useUserContext();

  return (
    <div className="dashboard-container min-h-screen flex flex-col">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex flex-1">
          {/* Sidemenu: visible on >=1024px (lg), hidden below */}
          <div className="hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main content grows and fills remaining space */}
          <div className="flex-1 min-w-0">
            <div className="dashboard-content">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
