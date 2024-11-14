import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; // Cambiamos addDoc por setDoc
import '../styles/LoginRegister.css';
import Spinner from "./Spinner";


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para el spinner
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Mostrar el spinner

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar los datos del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        phone: phone,
        email: email,
        role: "user"
      });

      // Redirigir al dashboard de cliente
      navigate("/dashboard");
    } catch (err) {
      setError("Error en el registro: " + err.message);
    }finally{
      setLoading(false); // Ocultar el spinner
    }


  };

  return (
    <div className="login-register-container">
      <h2>Crear cuenta</h2>
      {loading ? ( // Mostrar el spinner mientras carga
        <Spinner />
      ) : (
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
        {error && <p className="error-message">{error}</p>}
      </form>)}
      <p className="info-text">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Register;
