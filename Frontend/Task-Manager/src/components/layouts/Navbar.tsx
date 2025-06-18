import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

interface NavbarProps {
  activeMenu: string;
}

const Navbar = ({ activeMenu }: NavbarProps) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="navbar-dark flex gap-5 py-4 px-7 sticky top-0 z-30">
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

      {openSideMenu && (
        <div className="fixed top-[61px] -ml-4 mobile-sidemenu">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
