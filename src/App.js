// App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import CustomerDashboard from './Components/CustomerDashboard';
import SignUp from './Components/SignUp';
import ForgotPassword from './Components/ForgotPassword';
import 'process';
import { AuthProvider } from './AuthContext';
import { CartProvider, useCart }  from './CartContext';


function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* Wrap the entire app inside CartProvider */}
        <div className="App">
          <Router basename="/e-commerce-app">
          
            <Routes>
            <Route
                path="/"
                element={
                  // Serve the static index.html for the default path
                  <iframe
                    src={`${process.env.PUBLIC_URL}/Pages/index.html`}
                    style={{ width: '100%', height: '100vh', border: 'none' }}
                    title="Landing Page"
                  />
                }
              />
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/Dashboard/*" element={<Dashboard />} />
              <Route path="/customer-dashboard/*" element={<CustomerDashboard />} />
            </Routes>
          </Router>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
