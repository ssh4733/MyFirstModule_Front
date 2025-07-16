import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
