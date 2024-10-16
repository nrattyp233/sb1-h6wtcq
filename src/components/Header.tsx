import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, LogOut } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="mr-2" size={24} />
          <h1 className="text-2xl font-bold">Verified App</h1>
        </div>
        <nav>
          {isAuthenticated ? (
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:text-blue-200">Wallet</Link></li>
              <li><Link to="/send" className="hover:text-blue-200">Send</Link></li>
              <li><Link to="/verify" className="hover:text-blue-200">Verify</Link></li>
              <li><Link to="/link-bank" className="hover:text-blue-200">Link Bank</Link></li>
              <li>
                <button onClick={handleLogout} className="flex items-center hover:text-blue-200">
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="flex space-x-4">
              <li><Link to="/login" className="hover:text-blue-200">Login</Link></li>
              <li><Link to="/register" className="hover:text-blue-200">Register</Link></li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;