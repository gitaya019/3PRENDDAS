import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase-config'; // Ajusta la ruta si es necesario
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Detecta si el usuario está logueado
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchOrders(currentUser.uid);
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

  return (
    <div className="dashboard-container">
      <h1>Bienvenido {user ? user.displayName : 'Usuario'}</h1>
      <p>Esta es tu área de usuario.</p>
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
    </div>
  );
};

export default UserDashboard;
