import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/LOGO-3PD.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="3PRENDDAS" />
          <h1>3PRENDDAS</h1>
        </div>
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={`menu ${menuOpen ? "open" : ""}`}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu} // Cerramos el menú al hacer clic
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tienda"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu} // Cerramos el menú al hacer clic
            >
              Tienda
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu} // Cerramos el menú al hacer clic
            >
              Iniciar Sesión
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu} // Cerramos el menú al hacer clic
            >
              Registrarse
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/carrito"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu} // Cerramos el menú al hacer clic
            >
              <i className="fas fa-shopping-cart cart-icon"></i>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
