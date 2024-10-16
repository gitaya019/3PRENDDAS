import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;  
    
    // Crear la escena, cámara y renderer
    const scene = new THREE.Scene();
    const aspectRatio = 1;  // Mantener la relación de aspecto cuadrada
    const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);  
    camera.position.z = 12;  // Alejamos un poco más la cámara para asegurarnos de que el objeto se quede en el recuadro
    camera.position.y = 1.5;
  
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(600, 600);  // Canvas más grande pero manteniendo aspecto cuadrado
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);  // Usamos la variable local
  
    // Eliminamos el fondo, haciendo que sea transparente
    scene.background = null;
  
    // Agregar luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);  // Luz ambiente más brillante
    scene.add(ambientLight);
  
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
  
    // Grupo para centrar y rotar el objeto correctamente
    const group = new THREE.Group();
    scene.add(group);
  
    // Cargar el archivo OBJ
    const objLoader = new OBJLoader();
    objLoader.load(
      './models/Sudadera.obj',  // Asegúrate de que la ruta sea correcta
      (object) => {
        object.scale.set(0.35, 0.35, 0.35);  // Ajuste de la escala
        object.position.set(2, -3.4, 0);  // Ajustar la posicion del OBJ en la scena
        group.add(object);  
  
        object.traverse((child) => {
          if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({ color: 0x0073E6 });  // color para que coincida con el fondo
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
  
    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.maxPolarAngle = Math.PI / 2;  // Limita la rotación vertical para evitar que la cámara baje demasiado
    controls.minPolarAngle = Math.PI / 4;  // Limita la rotación vertical hacia arriba
  
    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
  
      group.rotation.y += 0.01;  // Ajusta la velocidad de rotación según sea necesario

      // Actualizar controles
      controls.update();
  
      // Renderizar la escena
      renderer.render(scene, camera);
    };
    animate();
  
    // Cleanup al desmontar
    return () => {
      currentMount.removeChild(renderer.domElement);  
    };
  }, []);
  
  return <div ref={mountRef} style={{ width: '600px', height: '600px', overflow: 'hidden' }} />;  // Ajustamos el tamaño del canvas
};

export default ThreeScene;
