import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import '../styles/ProductDetail.css';
import Spinner from './Spinner'; // Asegúrate de que Spinner esté correctamente importado
import PropTypes from 'prop-types'; // Importar PropTypes

const ThreeSceneTienda = ({ modelURL, color }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const groupRef = useRef(null); // Referencia al grupo para limpiar objetos

  useEffect(() => {
    const currentMount = mountRef.current;

    // Crear la escena, cámara y renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Configurar el renderer para que ocupe el tamaño del contenedor
    const resizeRenderer = () => {
      const { clientWidth, clientHeight } = currentMount;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    resizeRenderer();
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio)); // Limitar a un máximo de 2 para reducir el consumo de memoria en dispositivos con alto DPI
    currentMount.appendChild(renderer.domElement);

    scene.background = null;

    // Agregar luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Crear y añadir el grupo
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Instanciar controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 1.2;

    // Función para cargar el modelo OBJ
    const loadModel = () => {
      setLoading(true);

      // Limpiar el grupo de cualquier modelo anterior
      while (groupRef.current.children.length > 0) {
        const oldObject = groupRef.current.children[0];
        oldObject.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
        groupRef.current.remove(oldObject);
      }

      // Cargar el archivo OBJ desde la URL de Firebase
      const objLoader = new OBJLoader();
      objLoader.load(
        modelURL,
        (object) => {
          object.traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({ color });
            }
          });

          // Calcular la caja envolvente del modelo
          const box = new THREE.Box3().setFromObject(object);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Centrar el modelo
          object.position.sub(center); // Mover el modelo al origen
          groupRef.current.add(object);

          // Ajustar la cámara para que el modelo esté visible
          const maxDimension = Math.max(size.x, size.y, size.z);
          camera.position.z = maxDimension * 1.5;

          setLoading(false);
          renderer.render(scene, camera); // Renderizar inmediatamente después de cargar
        },
        undefined,
        (error) => {
          console.log('Error al cargar el modelo:', error);
          setLoading(false);
        }
      );
    };

    loadModel();

    // Renderizar solo cuando los controles cambien
    controls.addEventListener('change', () => renderer.render(scene, camera));

    // Ajustar el tamaño del renderer al redimensionar la ventana
    window.addEventListener('resize', resizeRenderer);

    return () => {
      window.removeEventListener('resize', resizeRenderer);
      currentMount.removeChild(renderer.domElement);
      controls.dispose(); // Eliminar controles al desmontar
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
    };
  }, [modelURL, color]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      {loading && <Spinner />}
    </div>
  );
};

// Validación de props
ThreeSceneTienda.propTypes = {
  modelURL: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default ThreeSceneTienda;
