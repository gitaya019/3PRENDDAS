// Products.jsx
import '../styles/Products.css'

const Products = () => {
  return (
    <section className="products">
      <h2>Productos Populares</h2>
      <div className="product-list">
        <div className="product-item">
          <img src="/path-to-shirt.png" alt="Camisa" />
          <h3>Camisa oversize</h3>
          <p>$30.000</p>
        </div>
        <div className="product-item">
          <img src="/path-to-hat.png" alt="Gorra" />
          <h3>Gorra 3PRENDDAS</h3>
          <p>$25.000</p>
        </div>
        <div className="product-item">
          <img src="/path-to-hoodie.png" alt="Hoodie" />
          <h3>Hoodie 3DPso</h3>
          <p>$60.000</p>
        </div>
      </div>
    </section>
  );
};

export default Products;
