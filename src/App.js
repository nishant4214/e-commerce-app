import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import SignUp from './Components/SignUp';
import 'process';

function App() {
  return (
    <div className="App">
      <Router basename="/e-commerce-app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/Dashboard/*" element={<Dashboard />} /> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
