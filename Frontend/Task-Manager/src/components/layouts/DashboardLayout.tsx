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
    <div className="dashboard-container">
      <Navbar activeMenu={activeMenu} />

      {user && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          <div className="grow">
            <div className="dashboard-content">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
