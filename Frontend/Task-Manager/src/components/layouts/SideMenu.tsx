import { useEffect, useState } from "react";
import { useUserContext } from "../../hooks/useUserContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from "../../utils/data";
import type { IconType } from "react-icons";

// Define the menu item type
interface MenuItem {
  id: string;
  label: string;
  icon: IconType;
  path: string;
}

interface SideMenuProps {
  activeMenu: string;
}

const SideMenu = ({ activeMenu }: SideMenuProps) => {
  const { user, clearUser } = useUserContext();
  const [sideMenuData, setSideMenuData] = useState<MenuItem[]>([]);

  const navigate = useNavigate();

  const handleClick = (route: string) => {
    if (route === "logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      const menu = user.role === "admin" ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA;
      setSideMenuData(menu);
    }
  }, [user]);

  return (
    <div className="sidemenu-container w-64 h-[calc(100vh-61px)] sticky top-[61px] z-20">
      <div className="sidemenu-profile-section flex flex-col items-center justify-center pt-5 pb-4 mt-4">
        <div className="relative">
          <img
            src={user?.profileImageUrl}
            alt="Profile Image"
            className="sidemenu-profile-image"
          />
        </div>

        {user?.role === "admin" && (
          <div className="sidemenu-admin-badge mt-2">Admin</div>
        )}

        <h5 className="sidemenu-user-name leading-6 mt-3">
          {user?.name || ""}
        </h5>
        <p className="sidemenu-user-email">{user?.email || ""}</p>
      </div>

      <div className="mt-4">
        {sideMenuData.map((item) => (
          <button
            key={`menu_${item.id}`}
            className={`sidemenu-item ${
              activeMenu === item.label ? "sidemenu-item-active" : ""
            }`}
            onClick={() => handleClick(item.path)}>
            <item.icon className="text-lg" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
