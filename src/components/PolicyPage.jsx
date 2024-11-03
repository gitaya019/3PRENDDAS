import "../styles/PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="main-privacity">
      <div className="privacy-policy">
        <h1 className="title">Políticas de Privacidad</h1>
        <p className="update-date">Última actualización: [Fecha]</p>
        <p>
          En [Nombre de la Tienda], nos comprometemos a proteger su privacidad.
          Esta política explica cómo recopilamos, utilizamos y compartimos su
          información personal cuando visita nuestro sitio web [URL del sitio
          web] o realiza una compra.
        </p>
        <h2>1. Información que recopilamos</h2>
        <p>Recopilamos la siguiente información cuando usted:</p>
        <ul>
          <li>Realiza un pedido en nuestro sitio.</li>
          <li>Crea una cuenta.</li>
          <li>Se suscribe a nuestro boletín de noticias.</li>
          <li>Interactúa con nuestro sitio web (cookies, análisis, etc.).</li>
        </ul>
        <p>La información que podemos recopilar incluye, entre otros:</p>
        <ul>
          <li>Nombre</li>
          <li>Dirección de envío</li>
          <li>Dirección de facturación</li>
          <li>Correo electrónico</li>
          <li>Número de teléfono</li>
          <li>
            Información de pago (número de tarjeta de crédito/débito, fecha de
            caducidad, etc.)
          </li>
        </ul>

        <h2>2. Uso de la información</h2>
        <p>Usamos su información para:</p>
        <ul>
          <li>Procesar y gestionar su pedido.</li>
          <li>
            Comunicarnos con usted sobre su pedido y responder a sus consultas.
          </li>
          <li>Mejorar nuestro sitio web y servicios.</li>
          <li>
            Enviar boletines de noticias y promociones, si ha optado por
            recibirlos.
          </li>
          <li>Cumplir con nuestras obligaciones legales.</li>
        </ul>

        <h2>3. Compartir información</h2>
        <p>
          No vendemos ni alquilamos su información personal a terceros. Sin
          embargo, podemos compartir su información con:
        </p>
        <ul>
          <li>
            Proveedores de servicios que nos ayudan a operar nuestro negocio
            (por ejemplo, procesadores de pagos, servicios de envío).
          </li>
          <li>Autoridades legales si es necesario para cumplir con la ley.</li>
        </ul>

        <h2>4. Seguridad</h2>
        <p>
          Implementamos medidas de seguridad para proteger su información
          personal. Sin embargo, ninguna transmisión de datos a través de
          Internet es completamente segura. Hacemos todo lo posible para
          proteger su información, pero no podemos garantizar su seguridad
          absoluta.
        </p>

        <h2>5. Sus derechos</h2>
        <p>Usted tiene el derecho de:</p>
        <ul>
          <li>Acceder a su información personal.</li>
          <li>Solicitar la corrección de su información.</li>
          <li>Solicitar la eliminación de su información personal.</li>
          <li>Retirar su consentimiento para el uso de su información.</li>
        </ul>

        <h2>6. Cambios a esta política</h2>
        <p>
          Nos reservamos el derecho de modificar esta política de privacidad en
          cualquier momento. Le notificaremos sobre cambios significativos a
          través de nuestro sitio web o por correo electrónico.
        </p>

        <h2>7. Contacto</h2>
        <p>
          Si tiene preguntas o inquietudes sobre esta política, contáctenos en:
        </p>
        <p>Correo electrónico: [correo electrónico de contacto]</p>
        <p>Teléfono: [número de teléfono de contacto]</p>
        <p>Dirección: [dirección de la tienda]</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
