import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase-config';
import ThreeSceneTienda from './ThreeSceneTienda';
import '../styles/Tienda.css';

const Tienda = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productCollection);
        
        const productList = productSnapshot.docs.map((doc) => {
          const data = doc.data();
          // Usamos el ID real del documento de Firestore
          return {
            firebaseId: doc.id,  // ID real de Firestore
            ...data,
          };
        });
        
        console.log("Productos cargados:", productList);
        setProducts(productList);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    // Usamos el ID de Firestore para la navegación
    console.log("Navegando al producto con ID:", product.firebaseId);
    navigate(`/producto/${product.firebaseId}`);
  };

  if (loading) {
    return <div className="loading-container">Cargando productos...</div>;
  }

  return (
    <div className="store-container">
      <div className="products">
        {products.map((product) => (
          <div 
            key={product.firebaseId}
            className="product-card" 
            onClick={() => handleProductClick(product)}
            style={{ cursor: 'pointer' }}
          >
            <ThreeSceneTienda modelURL={product.fileURL} />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>Precio: ${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tienda;