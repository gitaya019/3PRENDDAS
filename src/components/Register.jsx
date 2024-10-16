import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config"; // Asegúrate de importar Firestore
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore"; // Importa Firestore
import '../styles/LoginRegister.css';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(""); // Nuevo campo para el nombre
  const [phone, setPhone] = useState(""); // Nuevo campo para el teléfono
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coinciden
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      // Crear el usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid, // Almacenar el UID del usuario
        name: name,
        phone: phone,
        email: email,
      });

      // Redirigir al dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Error en el registro: " + err.message);
    }
  };

  return (
    <div className="login-register-container">
      <h2>Crear cuenta</h2>
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
      </form>
      <p className="info-text">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default Register;
