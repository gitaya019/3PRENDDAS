// components/ResetPassword.js
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase-config";
import '../styles/LoginRegister.css';

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Correo de restablecimiento enviado, revisa tu bandeja de entrada.");
      setError(""); // Limpiar cualquier error anterior
    } catch (err) {
      setError("Error al enviar el correo de restablecimiento: " + err.message);
      setMessage(""); // Limpiar el mensaje anterior
    }
  };

  return (
    <div className="login-register-container">
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Enviar correo de restablecimiento</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
