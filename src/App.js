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
import { WishlistProvider, useWishlist }  from './WishlistContext';

import HomePage from './Components/HomePage';
import ProductDetailsPage from './Components/ProductDetailsPage';
import ProfilePage from './Components/Profile';

function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <WishlistProvider>
        <div className="App">
          <Router basename="/e-commerce-app">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/SignUp" element={<SignUp />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/Dashboard/*" element={<Dashboard />} />
              <Route path="/customer-dashboard/*" element={<CustomerDashboard />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
            </Routes>
          </Router>
        </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
