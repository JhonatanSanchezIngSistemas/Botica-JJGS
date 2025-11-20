import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<h1>Bienvenido a Botica JJGS</h1>} />
          <Route path="/login" element={<h1>Login Page (To Do)</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
