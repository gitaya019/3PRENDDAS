import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import '../styles/Tienda.css';
import Spinner from './Spinner'; // Asegúrate de que Spinner esté correctamente importado
import PropTypes from 'prop-types'; // Importar PropTypes

const ThreeSceneTienda = ({ modelURL }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    const currentMount = mountRef.current;

    // Crear la escena, cámara y renderer
    const scene = new THREE.Scene();
    const aspectRatio = 1;
    const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(300, 300);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)); // Limitar a un máximo de 2 para optimizar en pantallas de alta densidad
    currentMount.appendChild(renderer.domElement);

    scene.background = null;

    // Agregar luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    const group = new THREE.Group();
    scene.add(group);

    // Cargar el archivo OBJ desde la URL de Firebase
    const objLoader = new OBJLoader();
    objLoader.load(
      modelURL,
      (object) => {
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x0073e6 });
          }
        });

        // Calcular la caja envolvente del modelo
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Centrar el modelo
        object.position.sub(center); // Mover el modelo al origen
        group.add(object);

        // Ajustar la cámara para que el modelo esté visible
        const maxDimension = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDimension * 1.5; // Ajustar distancia según el tamaño del modelo
        
        setLoading(false); // Marcar la carga como completa
        renderer.render(scene, camera); // Renderizar una vez
      },
      undefined,
      (error) => {
        console.log('Error al cargar el modelo:', error);
        setLoading(false); // Asegúrate de marcar la carga como completa en caso de error
      }
    );

    // Manejar el ajuste de tamaño del renderer
    const handleResize = () => {
      const { clientWidth, clientHeight } = currentMount;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera); // Renderizar tras cambio de tamaño
    };

    window.addEventListener('resize', handleResize);

    // Limpieza al desmontar
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);

      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });

      renderer.dispose();
    };
  }, [modelURL]);

  return (
    <div ref={mountRef} style={{ width: '300px', height: '300px', overflow: 'hidden' }}>
      {loading && <Spinner />} {/* Mostrar el spinner mientras se carga */}
    </div>
  );
};

// Validación de props
ThreeSceneTienda.propTypes = {
  modelURL: PropTypes.string.isRequired, // Asegúrate de que modelURL sea una cadena y sea requerido
};

export default ThreeSceneTienda;
