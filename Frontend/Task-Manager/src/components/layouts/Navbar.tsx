import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

interface NavbarProps {
  activeMenu: string;
}

const Navbar = ({ activeMenu }: NavbarProps) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="navbar-dark flex gap-5 px-4 py-3 sticky top-0 z-30 h-[61px] items-center">
      {/* Hamburger button: visible below lg (1024px) */}
      <button
        className="navbar-button block lg:hidden"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}>
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="navbar-text text-lg">Task Manager</h2>

      {/* Mobile sidemenu overlay */}
      {openSideMenu && (
        <div className="fixed top-[61px] left-0 w-64 h-[calc(100vh-61px)] z-40 mobile-sidemenu">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
