import { useState, useEffect } from "react";
import { db, storage, auth } from "../firebase-config";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/AdminDashboard.css";
import Spinner from "./Spinner"; // Suponiendo que tienes un componente Spinner

const AdminDashboard = () => {
  const [view, setView] = useState("products");
  const [productTitle, setProductTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [file, setFile] = useState(null);
  const [stock, setStock] = useState("");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false); // Spinner state
  const [user, setUser] = useState(null);

  // Chequear si el usuario está autenticado al recargar la página
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        window.location.href = "/login"; // Redirigir al login si no hay usuario
      }
    });
  }, []);

  // Validaciones simples
  const validateForm = () => {
    if (!productTitle || !description || !price || !size || !stock || !file) {
      alert("Todos los campos son obligatorios.");
      return false;
    }
    if (isNaN(price) || isNaN(stock)) {
      alert("Precio y stock deben ser números.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productsArray = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(productsArray);
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersArray = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setUsers(usersArray);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const productId = uuidv4();
      let downloadURL = "";

      if (file) {
        const storageRef = ref(storage, `products/${productId}/${file.name}`);
        await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, "products"), {
        id: productId,
        title: productTitle,
        description,
        price,
        size,
        stock,
        fileURL: downloadURL,
      });

      // Resetear campos
      setProductTitle("");
      setDescription("");
      setPrice("");
      setSize("");
      setStock("");
      setFile(null);
      alert("Producto creado exitosamente.");
      fetchProducts();
    } catch (error) {
      console.error("Error creando el producto:", error);
      alert("Hubo un error creando el producto.");
    } finally {
      setIsLoading(false); // Detener spinner
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const saveUserChanges = async () => {
    if (selectedUser) {
      const userDoc = doc(db, "users", selectedUser.id);
      await updateDoc(userDoc, {
        name: selectedUser.name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        role: selectedUser.role,
      });
      setIsEditUserModalOpen(false);
      fetchUsers();
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteDoc(doc(db, "users", selectedUser.id));
      setIsDeleteUserModalOpen(false);
      fetchUsers();
    }
  };

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      await deleteDoc(doc(db, "products", selectedProduct.id));
      setIsDeleteProductModalOpen(false);
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  if (!user) return <Spinner />; // Muestra el spinner hasta que la autenticación esté completa

  return (
    <div className="admin-dashboard">
      <h1>Bienvenido Administrador</h1>
      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
            <li onClick={() => setView("products")}>Crear Producto</li>
            <li onClick={() => setView("users")}>Gestionar Usuarios</li>
          </ul>
        </aside>

        {view === "products" && (
          <section className="create-product">
            <h2>Crear nuevo producto</h2>
            {isLoading ? (
              <Spinner />
            ) : (
              <form onSubmit={handleCreateProduct}>
                <input
                  type="text"
                  placeholder="Título del producto"
                  value={productTitle}
                  onChange={(e) => setProductTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Descripción"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Tamaño"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                />
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".obj"
                  required
                />
                <button type="submit">Crear Producto</button>
              </form>
            )}
            {/* Listado de productos creados */}
            <h2>Productos creados</h2>
            <div className="product-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <h3>{product.title}</h3>
                  <p>{product.description}</p>
                  <p>
                    <strong>Precio:</strong> ${product.price}
                  </p>
                  <p>
                    <strong>Tamaño:</strong> {product.size}
                  </p>
                  <p><strong>Stock:</strong> {product.stock}</p>
                  <a
                    href={product.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Archivo
                  </a>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsDeleteProductModalOpen(true);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            {isDeleteProductModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h3>
                    ¿Estás seguro de que deseas eliminar el producto{" "}
                    {selectedProduct.title}?
                  </h3>
                  <button onClick={handleDeleteProduct}>Sí, eliminar</button>
                  <button onClick={() => setIsDeleteProductModalOpen(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {view === "users" && (
          <section className="user-management">
            <h2>Gestión de Usuarios</h2>
            <div className="user-grid">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <h3>{user.name}</h3>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {user.phone}
                  </p>
                  <p>
                  <strong>Rol:</strong> {user.role}
                  </p>
                  <button
                    onClick={() => {
                      handleEditUser(user);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setIsDeleteUserModalOpen(true);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            {/* Modal para editar usuario */}
            {isEditUserModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h3>Editar Usuario</h3>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={selectedUser.name}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, name: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    value={selectedUser.phone}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.target.value,
                      })
                    }
                  />
                  <select
                    value={selectedUser.role}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        role: e.target.value,
                      })
                    }
                  >
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario</option>
                  </select>
                  <button onClick={saveUserChanges}>Guardar cambios</button>
                  <button onClick={() => setIsEditUserModalOpen(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Modal para eliminar usuario */}
            {isDeleteUserModalOpen && (
              <div className="modal">
                <div className="modal-content">
                  <h3>
                    ¿Estás seguro de que deseas eliminar al usuario{" "}
                    {selectedUser.name}?
                  </h3>
                  <button onClick={handleDeleteUser}>Sí, eliminar</button>
                  <button onClick={() => setIsDeleteUserModalOpen(false)}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;