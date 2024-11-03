import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer-links">
        <Link to="/terms">Términos y condiciones</Link> / <Link to="/policy">Políticas de privacidad</Link>
      </div>
      <p>Copyright © 2024 - 3PRENDDAS</p>
    </footer>
  );
};

export default Footer;
