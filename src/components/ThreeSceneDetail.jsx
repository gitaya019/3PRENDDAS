import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import '../styles/ProductDetail.css';
import Spinner from './Spinner'; // Asegúrate de que Spinner esté correctamente importado
import PropTypes from 'prop-types';

const ThreeSceneDetail = ({ modelURL }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Crear la escena, cámara y renderer
    const scene = new THREE.Scene();
    const aspectRatio = currentMount.clientWidth / currentMount.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
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

        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Centrar el modelo
        object.position.sub(center);
        group.add(object);

        // Ajustar la cámara
        const maxDimension = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDimension * 1.5;
        
        setLoading(false);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log('Error al cargar el modelo:', error);
        setLoading(false);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      currentMount.removeChild(renderer.domElement);
    };
  }, [modelURL]);
  return (
    <div ref={mountRef} style={{ width: '400px', height: '500px', overflow: 'hidden' }}>
      {loading && <Spinner />} {/* Mostrar el spinner mientras se carga */}
    </div>
  );

};

// Validación de props
ThreeSceneDetail.propTypes = {
  modelURL: PropTypes.string.isRequired,
};

export default ThreeSceneDetail;
