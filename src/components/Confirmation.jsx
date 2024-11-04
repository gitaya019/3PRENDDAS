import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Confirmation.css";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const state = location.state;
    if (state && state.orderDetails) {
      setOrderDetails(state.orderDetails);
    } else {
      navigate("/carrito");
    }
  }, [location, navigate]);

  return (
    <div className="confirmation-container">
      <h2>¡Gracias por tu compra!</h2>
      {orderDetails ? (
        <div className="confirmation-details">
          <h3>Resumen de tu pedido</h3>
          <h4>Productos:</h4>
          <ul>
            {orderDetails.items.map((item, index) => (
              <li key={index} className="confirmation-item">
                <p>{item.title} (Talla: {item.size}, Color: <span style={{ backgroundColor: item.color }} className="color-swatch"></span>)</p>
                <p>Precio: ${item.price.toLocaleString()} x {item.quantity}</p>
              </li>
            ))}
          </ul>
          <div className="confirmation-summary">
            <p>Subtotal: ${orderDetails.subtotal.toLocaleString()}</p>
            <p>Total: ${orderDetails.total.toLocaleString()}</p>
          </div>
          <h4>Información de Envío:</h4>
          <p>Nombre: {orderDetails.shippingInfo.fullName}</p>
          <p>Dirección: {orderDetails.shippingInfo.address}</p>
          <p>Ciudad: {orderDetails.shippingInfo.city}</p>
          <p>Código Postal: {orderDetails.shippingInfo.postalCode}</p>
          <p>Teléfono: {orderDetails.shippingInfo.phoneNumber}</p>
          <p>Método de Envío: {orderDetails.shippingMethod}</p>
        </div>
      ) : (
        <p>Cargando detalles del pedido...</p>
      )}
    </div>
  );
};

export default Confirmation;
