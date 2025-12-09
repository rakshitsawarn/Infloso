
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import HomePage from './pages/HomePage';

const PrivateRoute = ({ children }) => {
  const { accessToken, authLoading } = useAuth();

  if (authLoading)
    return <p className="mt-10 text-center text-gray-600">Checking session...</p>;

  return accessToken ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/" element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
