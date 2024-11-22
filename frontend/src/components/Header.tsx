import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import BlockchainLoginButton from "./BlockChainLoginButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar md:px-10 self-center items-center">
      <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary hover:text-secondary">
          CryptoDataMart
          </Link>
      </div>
      <div className="flex-none md:hidden dropdown dropdown-bottom dropdown-open dropdown-end">
        <button className={`btn btn-ghost text-primary text-2xl ${isMenuOpen && 'bg-primary/20'}`} onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
        {isMenuOpen && (
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-background outline outline-1 outline-primary/50 rounded-box w-52 items-center">
            <li>
              <Link to="/dashboard" className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-primary_text hover:text-secondary">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/community" className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-primary_text hover:text-secondary">
                Community
              </Link>
            </li>
          </ul>
        )}
      </div>
      <div className="flex-none hidden md:flex md:items-center">
        <ul className="menu menu-horizontal px-1 md:items-center gap-2">
          <li className="mx-2">
            <Link to="/dashboard" className="text-primary_text hover:text-secondary text-sm font-medium md:font-semibold md:text-md">
              Dashboard
            </Link>
          </li>
          <li className="mx-2">
            <Link to="/community" className="text-primary_text hover:text-secondary text-sm font-medium md:font-semibold md:text-md">
              Community
            </Link>
          </li>
          <li className="mx-2">
            <BlockchainLoginButton />
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Header;