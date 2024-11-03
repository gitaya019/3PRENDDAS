import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import ThreeSceneTienda from './ThreeSceneTienda';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        console.log("Buscando producto con ID de Firestore:", id);
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProduct({
            firebaseId: docSnap.id,
            ...productData,
          });
          console.log("Producto encontrado:", productData);
        } else {
          console.log("No se encontró el producto con ID:", id);
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
          <ThreeSceneTienda modelURL={product.fileURL} />
        </div>
        <div className="product-info-detail">
          <h1 className="product-title">{product.title}</h1>
          <p className="product-price">{typeof product.price === 'number' ? product.price.toLocaleString() : product.price}</p>
          <div className="product-metadata">
            <p><strong>Género:</strong> {product.gender}</p>
            <p><strong>Talla:</strong> {product.size}</p>
            <p><strong>Stock:</strong> {product.stock} unidades</p>
          </div>
          <div className="product-description">
            <h2>Descripción</h2>
            <p>{product.description}</p>
          </div>
          <button className="add-to-cart-btn">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;