import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import ThreeSceneDetail from './ThreeSceneDetail';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#0073e6');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID no encontrado");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProduct({
            firebaseId: docSnap.id,
            ...productData,
          });
        } else {
          setError("Producto no encontrado");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const colors = ["#0073e6", "#44bd32", "#7f8fa6", "#fed330", "#f7f1e3", "#EA2027", "#0000", "#2f3542"];

  const addToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona una talla.");
      return;
    }

    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const newItem = {
      id: product.firebaseId,
      title: product.title,
      image: product.imageURL,  // Asegúrate de tener una imagen para el producto
      size: selectedSize,
      color: selectedColor,
      price: product.price,
      quantity: 1
    };

    const existingItemIndex = storedCart.findIndex(
      item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
    );

    if (existingItemIndex >= 0) {
      storedCart[existingItemIndex].quantity += 1;
    } else {
      storedCart.push(newItem);
    }

    localStorage.setItem('cart', JSON.stringify(storedCart));
    alert("Producto agregado al carrito.");

    navigate('/carrito');
    window.location.reload();

  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => navigate('/tienda')}>Volver a la tienda</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <p>Producto no encontrado</p>
        <button onClick={() => navigate('/tienda')}>Volver a la tienda</button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button 
        className="back-button"
        onClick={() => navigate('/tienda')}
      >
        ← Volver a la tienda
      </button>
      <div className="product-detail-grid">
        <div className="product-model">
          <ThreeSceneDetail modelURL={product.fileURL} color={selectedColor} />
        </div>
        <div className="product-info-detail">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-price">${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}</p>
          <div className="product-metadata">
            <p><strong>Género:</strong> {product.gender}</p>
            <p><strong>Stock:</strong> {product.stock} unidades</p>
          </div>
          <div className="product-sizes">
            <h2>Talla</h2>
            <div className="size-buttons-container">
              {sizes.map(size => (
                <button 
                  key={size} 
                  className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="product-colors">
            <h2>Color</h2>
            <div className="color-buttons-container">
              {colors.map(color => (
                <button 
                  key={color} 
                  className={`color-button ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          <div className="product-description">
            <h2>Descripción</h2>
            <p>{product.description}</p>
          </div>
          <button onClick={addToCart} className="add-to-cart-btn">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
