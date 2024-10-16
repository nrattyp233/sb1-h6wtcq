import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Wallet from './components/Wallet';
import SendMoney from './components/SendMoney';
import VerifyTransaction from './components/VerifyTransaction';
import LinkBank from './components/LinkBank';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import Advertisements from './components/Advertisements';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register setIsAuthenticated={setIsAuthenticated} />
            } />
            <Route path="/" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Wallet />
              </PrivateRoute>
            } />
            <Route path="/send" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <SendMoney />
              </PrivateRoute>
            } />
            <Route path="/verify" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <VerifyTransaction />
              </PrivateRoute>
            } />
            <Route path="/link-bank" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <LinkBank />
              </PrivateRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {isAuthenticated && <Advertisements />}
        </main>
      </div>
    </Router>
  );
};

export default App;