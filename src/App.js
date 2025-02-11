import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Exchange from "./pages/Exchange";
import Account from "./pages/Account";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" />;
}
function App() {
  return (
  <AuthProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/exchange" element={<Exchange />} />
         <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
