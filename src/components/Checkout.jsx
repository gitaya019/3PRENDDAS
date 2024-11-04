import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase-config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "../styles/Checkout.css";
import camisa from "../assets/camisa.png";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
  });
  const [user, setUser] = useState(null);
  const [shippingMethod] = useState("Contraentrega");
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);

    const auth = getAuth();
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const orderData = {
      userId: user.uid,
      items: cartItems,
      shippingInfo,
      shippingMethod,
      subtotal: calculateSubtotal(),
      total: calculateSubtotal(),
      orderDate: Timestamp.fromDate(new Date()),
    };

    try {
      const orderRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Pedido registrado con ID:", orderRef.id);

      localStorage.removeItem("cart");
      navigate("/confirmation", { state: { orderDetails: orderData } });
    } catch (error) {
      console.error("Error al registrar el pedido:", error);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Finalizar Compra</h2>
      <div className="checkout-content">
        <div className="checkout-items">
          <h3>Productos en tu carrito</h3>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index} className="checkout-item">
                <img src={camisa} alt={item.title} className="checkout-item-image" />
                <div className="checkout-item-details">
                  <p>{item.title}</p>
                  <p>Talla: {item.size}</p>
                  <p>Color: <span style={{ backgroundColor: item.color }} className="color-swatch"></span></p>
                  <p>Precio: ${item.price.toLocaleString()}</p>
                  <p>Cantidad: {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="checkout-summary">
            <div className="checkout-total">
              <span>Subtotal</span>
              <span>${calculateSubtotal().toLocaleString()}</span>
            </div>
            <div className="checkout-total">
              <span>Total</span>
              <span>${calculateSubtotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="checkout-shipping">
          <h3>Información de Envío</h3>
          <form>
            <input
              type="text"
              name="fullName"
              placeholder="Nombre Completo"
              value={shippingInfo.fullName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={shippingInfo.address}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              value={shippingInfo.city}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Código Postal"
              value={shippingInfo.postalCode}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Número de Teléfono"
              value={shippingInfo.phoneNumber}
              onChange={handleInputChange}
              required
            />
            <div className="checkout-method">
              <h4>Método de Envío</h4>
              <p>{shippingMethod}</p>
            </div>
            <button type="button" onClick={handlePlaceOrder} className="place-order-btn">
              Realizar Pedido
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
