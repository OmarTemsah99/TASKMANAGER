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
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          <img
            src={user?.profileImageUrl}
            alt="Profile Image"
            className="w-20 h-20 bg-slate-400 rounded-full"
          />
        </div>

        {user?.role === "admin" && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0 rounded mt-1">
            Admin
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      {sideMenuData.map((item) => (
        <button
          key={`menu_${item.id}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label
              ? "text-primary-300 gradient-bg border-r-3"
              : ""
          } py-3 px-6 cursor-pointer`}
          onClick={() => handleClick(item.path)}>
          <item.icon className="" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;
