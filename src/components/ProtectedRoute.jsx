import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import PropTypes from 'prop-types'; // Importar PropTypes

const ProtectedRoute = ({ children, roleRequired }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const checkUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setRole(userData.role);

          if (userData.role !== roleRequired) {
            navigate("/"); // Redirigir si no tiene el rol necesario
          }
        }
      } else {
        navigate("/login"); // Redirigir si no está autenticado
      }
      setLoading(false);
    };

    checkUserRole();
  }, [auth, navigate, roleRequired]);

  if (loading) {
    return <div>Cargando...</div>; // Añadir spinner si lo deseas
  }

  return role === roleRequired ? children : null;
};

// Validación de propiedades
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Definir que 'children' es requerido
  roleRequired: PropTypes.string.isRequired // Definir que 'roleRequired' es requerido
};

export default ProtectedRoute;
