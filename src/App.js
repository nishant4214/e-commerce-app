import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import CustomerDashboard from './Components/CustomerDashboard';
import SignUp from './Components/SignUp';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';

function App() {
  return (
    <CartProvider> {/* Wrap the entire app inside CartProvider */}
      <div className="App">
        <Router basename="/e-commerce-app">
          <Routes>
            {/* Non-authenticated routes */}
            <Route path="/" element={<Login />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/ResetPassword" element={<ResetPassword />} />

            {/* Authenticated routes wrapped with AuthProvider */}
            <AuthProvider>
              <Route path="/Dashboard/*" element={<Dashboard />} />
              <Route path="/customer-dashboard/*" element={<CustomerDashboard />} />
            </AuthProvider>
          </Routes>
        </Router>
      </div>
    </CartProvider>
  );
}

export default App;
