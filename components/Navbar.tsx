import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; 
import Link from "next/link";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-custom-gradient text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Envolver el texto MyApp en un componente Link */}
        <Link href="/" className="text-2xl font-semibold">
          MyApp
        </Link>
        <button className="md:hidden flex items-center" onClick={toggleMenu}>
          {isOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
        <ul
          className={`md:flex md:items-center md:space-x-4 absolute md:relative bg-custom-gradient md:bg-none w-full md:w-auto top-16 left-0 md:top-0 transition-transform transform ${
            isOpen ? "translate-x-0" : "hidden"
          }`}
        >
          <li>
            <Link href="/" className="block px-4 py-2">
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" className="block px-4 py-2">
              Products
            </Link>
          </li>
          <li>
            <Link href="/providers" className="block px-4 py-2">
              Providers
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
