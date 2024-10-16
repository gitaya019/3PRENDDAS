// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Inicio from './components/inicio';
import Login from './components/login';
import Footer from './components/Footer';
import Register from './components/Register';
import ResetPassword from './components/ResetPassword';
import './styles/App.css';


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
