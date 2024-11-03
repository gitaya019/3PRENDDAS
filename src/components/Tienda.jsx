import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import '../styles/Tienda.css';
import PropTypes from 'prop-types';

const ThreeScene = ({ modelURL }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;

    // Crear la escena, cámara y renderer
    const scene = new THREE.Scene();
    const aspectRatio = 1;
    const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    camera.position.z = 12;
    camera.position.y = 1.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(300, 300); 
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
        object.scale.set(0.35, 0.35, 0.35);
        object.position.set(2, -3.4, 0);
        group.add(object);

        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x0073e6 });
          }
        });
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log('Error al cargar el modelo:', error);
      }
    );

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 4;

    const animate = () => {
      requestAnimationFrame(animate);
      group.rotation.y += 0.01;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      currentMount.removeChild(renderer.domElement);
    };
  }, [modelURL]);

  return <div ref={mountRef} style={{ width: '300px', height: '300px', overflow: 'hidden' }} />;
};

const Tienda = () => {
  const [products, setProducts] = useState([]);

  // Fetch productos desde Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
    };
    fetchProducts();
  }, []);

  return (
    <div className="store-container">
      <div className="products">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <ThreeScene modelURL={product.fileURL} />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>Precio: ${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ThreeScene.propTypes = {
  modelURL: PropTypes.string.isRequired,
};

export default Tienda;
