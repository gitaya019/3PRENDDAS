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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { onAuthStateChanged } from "firebase/auth";
import "../styles/AdminDashboard.css";
import Spinner from "./Spinner";

const AdminDashboard = () => {
  const [view, setView] = useState("products");
  const [productTitle, setProductTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [sizeType, setSizeType] = useState("letter"); // "letter" o "number"
  const [gender, setGender] = useState("unisex");
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
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  const letterSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
  const numberSizes = Array.from({ length: 13 }, (_, i) => (i + 30).toString());

  const formatPrice = (value) => {
    const number = parseInt(value.replace(/\D/g, ""));
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  const validateForm = () => {
    // Verificar que todos los campos estén llenos
    if (
      !productTitle ||
      !description ||
      !price ||
      !size ||
      !stock ||
      !file ||
      !gender
    ) {
      alert("Todos los campos son obligatorios.");
      return false;
    }

    // Comprobar que el precio y el stock sean números
    const numericPrice = parseFloat(price.replace(/[^\d.-]/g, ""));
    const numericStock = parseInt(stock, 10);

    if (isNaN(numericPrice) || isNaN(numericStock)) {
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

      const numericPrice = parseFloat(price.replace(/[^\d]/g, ""));

      await addDoc(collection(db, "products"), {
        id: productId,
        title: productTitle,
        description,
        price: numericPrice,
        size,
        sizeType,
        gender,
        stock,
        fileURL: downloadURL,
      });

      setProductTitle("");
      setDescription("");
      setPrice("");
      setSize("");
      setSizeType("letter");
      setGender("unisex");
      setStock("");
      setFile(null);
      alert("Producto creado exitosamente.");
      fetchProducts();
    } catch (error) {
      console.error("Error creando el producto:", error);
      alert("Hubo un error creando el producto.");
    } finally {
      setIsLoading(false);
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
      try {
        // Get the file reference from the fileURL
        const fileURL = selectedProduct.fileURL;
        const fileRef = ref(storage, fileURL);

        // Delete the file from storage
        await deleteObject(fileRef);
        console.log("File deleted successfully");

        // Now delete the product document from Firestore
        await deleteDoc(doc(db, "products", selectedProduct.id));
        console.log("Product deleted successfully");

        // Close the modal and refresh the product list
        setIsDeleteProductModalOpen(false);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Hubo un error eliminando el producto.");
      }
    }
  };
  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  if (!user) return <Spinner />;

  return (
    <div className="admin-dashboard">
      <h1>Bienvenido Administrador</h1>
      <div className="dashboard-content">
        <aside className="sidebar">
          <ul>
            <li onClick={() => setView("products")}>Crear Producto</li>
            <li onClick={() => setView("productList")}>Lista de Productos</li>
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
                  type="text"
                  placeholder="Precio"
                  value={price}
                  onChange={(e) => {
                    const formattedPrice = formatPrice(e.target.value);
                    setPrice(formattedPrice);
                  }}
                  required
                />
                <div className="size-selector">
                  <div className="size-type-toggle">
                    <button
                      type="button"
                      className={sizeType === "letter" ? "active" : ""}
                      onClick={() => setSizeType("letter")}
                    >
                      Tallas (XS-XXXL)
                    </button>
                    <button
                      type="button"
                      className={sizeType === "number" ? "active" : ""}
                      onClick={() => setSizeType("number")}
                    >
                      Tallas Numéricas
                    </button>
                  </div>
                  <div className="size-buttons">
                    {(sizeType === "letter" ? letterSizes : numberSizes).map(
                      (s) => (
                        <button
                          key={s}
                          type="button"
                          className={
                            size === s ? "size-button active" : "size-button"
                          }
                          onClick={() => setSize(s)}
                        >
                          {s}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div className="gender-selector">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="unisex">Unisex</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                  </select>
                </div>
                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
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
          </section>
        )}

        {view === "productList" && (
          <section className="product-list">
            <div className="products-container">
              <h2 className="products-title">Productos creados</h2>
              <div className="product-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-content">
                      <h3>{product.title}</h3>
                      <p className="product-description">
                        {product.description}
                      </p>
                      <div className="product-details">
                        <p>
                          <strong>Precio:</strong>{" "}
                          {formatPrice(product.price.toString())}
                        </p>
                        <p>
                          <strong>Talla:</strong> {product.size}
                        </p>
                        <p>
                          <strong>Género:</strong> {product.gender}
                        </p>
                        <p>
                          <strong>Stock:</strong> {product.stock}
                        </p>
                      </div>
                      <div className="product-actions">
                        <a
                          href={product.fileURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="view-file-btn"
                        >
                          Ver Archivo
                        </a>
                        <button
                          className="delete-btn"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsDeleteProductModalOpen(true);
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <button onClick={() => handleEditUser(user)}>Editar</button>
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
