import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import '../styles/LoginRegister.css';
import Spinner from "./Spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para el spinner
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Mostrar el spinner

    if (email === "" || password === "") {
      setError("Todos los campos son obligatorios");
      setLoading(false); // Ocultar el spinner
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        console.log("No se encontraron datos del usuario");
      }
    } catch (err) {
      setError("Error en el inicio de sesión: " + err.message);
    } finally {
      setLoading(false); // Ocultar el spinner
    }
  };

  return (
    <div className="login-register-container">
      <h2>Iniciar sesión</h2>
      {loading ? ( // Mostrar el spinner mientras carga
        <Spinner />
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Iniciar sesión</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
      <p className="info-text">
        ¿Olvidaste tu contraseña? <Link to="/reset-password">Restablecer</Link>
      </p>
      <p className="info-text">
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </div>
  );
};

export default Login;
