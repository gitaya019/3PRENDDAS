import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Importa onAuthStateChanged
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, roleRequired }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setRole(userData.role);

          if (userData.role !== roleRequired) {
            navigate("/"); // Redirige si no tiene el rol necesario
          }
        }
      } else {
        navigate("/login"); // Redirige si no está autenticado
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Limpieza del listener al desmontar
  }, [auth, navigate, roleRequired]);

  if (loading) {
    return <div>Cargando...</div>; // Puedes cambiarlo por un spinner si prefieres
  }

  return role === roleRequired ? children : null;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roleRequired: PropTypes.string.isRequired,
};

export default ProtectedRoute;
