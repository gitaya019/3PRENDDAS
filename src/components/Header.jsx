import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, query, collection, where, getDocs } from "firebase/firestore";
import "../styles/Header.css";
import logo from "../assets/LOGO-3PD.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const userMenuRef = useRef(null);

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserLoggedIn(true);
        
        // Buscar el documento en Firestore con el correo del usuario autenticado
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserName(userData.name);  // Traer el nombre del usuario
        });
      } else {
        setUserLoggedIn(false);
        setUserName("");
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  // Función para cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    setUserLoggedIn(false);
    setUserName("");
    setUserMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Cerrar el menú de usuario al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    // Añadir el listener cuando el menú está abierto
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

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
            <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to="/tienda" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
              Tienda
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/carrito"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={closeMenu}
            >
              <i className="fas fa-shopping-cart cart-icon"></i>
            </NavLink>
          </li>

          {userLoggedIn ? (
            <div className="user-menu" onClick={toggleUserMenu} ref={userMenuRef}>
              <div className="user-icon">
                <span>{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
              </div>
              <div className={`user-dropdown ${userMenuOpen ? "open" : ""}`}>
                <ul>
                  <li>
                    <NavLink to="/mis-compras" onClick={closeMenu}>
                      Mis compras
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/mi-cuenta" onClick={closeMenu}>
                      Mi cuenta
                    </NavLink>
                  </li>
                  <li onClick={handleLogout}>
                    Cerrar sesión
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
                  Iniciar Sesión
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => (isActive ? "active" : "")} onClick={closeMenu}>
                  Registrarse
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
