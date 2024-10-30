import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import SignUp from './Components/SignUp';
import AddProduct from './Components/AddProductForm';
import 'process';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/*" element={<Dashboard />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
