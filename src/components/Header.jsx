import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom"; 
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, query, collection, where, getDocs } from "firebase/firestore";
import "../styles/Header.css";
import logo from "../assets/LOGO-3PD.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0); // Estado para cantidad de ítems en el carrito
  const auth = getAuth();
  const db = getFirestore();
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserLoggedIn(true);
        
        const q = query(collection(db, "users"), where("email", "==", user.email));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          setUserName(userData.name);
          setUserRole(userData.role);
        });
      } else {
        setUserLoggedIn(false);
        setUserName("");
        setUserRole("");
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  // Cargar la cantidad de ítems en el carrito desde localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemCount = storedCart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(itemCount);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUserLoggedIn(false);
    setUserName("");
    setUserRole("");
    setUserMenuOpen(false);
    window.location.reload();
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleAccountClick = () => {
    if (userRole === "admin") {
      navigate("/admin-dashboard");
    } else if (userRole === "user") {
      navigate("/dashboard");
    }
    setUserMenuOpen(false);
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
              {cartItemCount > 0 && (
                <span className="cart-count">{cartItemCount}</span>
              )}
            </NavLink>
          </li>

          {userLoggedIn ? (
            <div className="user-menu" onClick={toggleUserMenu} ref={userMenuRef}>
              <div className="user-icon">
                <span>{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
              </div>
              <div className={`user-dropdown ${userMenuOpen ? "open" : ""}`}>
                <ul>
                  <li onClick={handleAccountClick}>
                    Mi cuenta
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
