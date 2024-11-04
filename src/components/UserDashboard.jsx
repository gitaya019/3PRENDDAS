import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase-config'; // Ajusta la ruta si es necesario
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    // Detecta si el usuario está logueado
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchOrders(currentUser.uid);
        fetchUserData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // Función para obtener las órdenes desde Firestore
  const fetchOrders = async (userId) => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
    }
  };

  // Función para obtener los datos del usuario desde Firestore
  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData({
          displayName: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
        });
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  // Función para manejar el cambio en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para guardar los cambios de los datos del usuario
  const handleSave = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          name: formData.displayName,
          email: formData.email,
          phone: formData.phone,
        });
        setEditing(false);
      } catch (error) {
        console.error('Error al actualizar los datos del usuario:', error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Bienvenido {user ? formData.displayName : 'Usuario'}</h1>
      <p>Esta es tu área de usuario.</p>

      {/* Barra superior con secciones */}
      <div className="dashboard-tabs">
        <h2 onClick={() => setEditing(false)} className={!editing ? 'active-tab' : ''}>Mis Órdenes</h2>
        <h2 onClick={() => setEditing(true)} className={editing ? 'active-tab' : ''}>Mis Datos</h2>
      </div>

      {/* Sección de Órdenes */}
      {!editing && (
        <div className="orders-list">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <h3>Compra realizada el: {new Date(order.orderDate.seconds * 1000).toLocaleString()}</h3>
                <p><strong>Nombre:</strong> {order.shippingInfo.fullName}</p>
                <p><strong>Dirección:</strong> {order.shippingInfo.address}, {order.shippingInfo.city}</p>
                <p><strong>Método de envío:</strong> {order.shippingInfo.shippingMethod}</p>
                <p><strong>Total:</strong> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(order.total)}</p>
                <div className="items-list">
                  <h4>Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="item-card">
                      <p><strong>Producto:</strong> {item.title}</p>
                      <p><strong>Color:</strong> {item.color}</p>
                      <p><strong>Tamaño:</strong> {item.size}</p>
                      <p><strong>Cantidad:</strong> {item.quantity}</p>
                      <p><strong>Precio:</strong> {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.price)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No tienes compras registradas.</p>
          )}
        </div>
      )}

      {/* Sección de Datos */}
      {editing && (
        <div className="user-data-form">
          <h3>Editar Mis Datos</h3>
          <form onSubmit={handleSave}>
            <label>
              Nombre:
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Teléfono:
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Guardar Cambios</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
