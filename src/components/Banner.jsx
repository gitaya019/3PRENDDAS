// Banner.jsx
import { NavLink } from 'react-router-dom'; // Importamos NavLink
import ThreeScene from './ThreeScene'; // Importamos el componente Three.js
import '../styles/Banner.css';

const Banner = () => {
  return (
    <section className="banner">
      <div className="banner-text">
        <h1>3PRENDDAS</h1>
        <p>
          3PRENDDAS es una plataforma de moda que permite visualizar ropa en 3D antes de comprarla. Ofrece una amplia variedad de estilos. 
          <br />Los verdaderos estilos urbanos.
        </p>
        <NavLink to="/tienda" className="cta-button">Ir a Comprar</NavLink> {/* Cambiado a NavLink */}
      </div>
      <div className="banner-scene">
        <ThreeScene /> {/* Aquí colocamos la escena 3D */}
      </div>
    </section>
  );
};

export default Banner;
