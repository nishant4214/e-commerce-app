import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import SignUp from './Components/SignUp';
import AddProduct from './Components/AddProductForm';

function App() {
  // Assuming you have a simple authentication state (can be managed via context or useState)
  const isAuthenticated = false; // Replace this with actual authentication logic

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route for Login page */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          
          {/* Route for SignUp page */}
          <Route path="/SignUp" element={<SignUp />} />
          
          {/* Route for Dashboard page */}
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
          
          {/* Catch-all route (if user tries to access other paths) */}
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
