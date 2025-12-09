import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); 

  useEffect(() => {
    const checkRefresh = async () => {
      try {
        const res = await api.post("/auth/refresh"); 
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
      } catch (err) {
        setAccessToken(null);
        setUser(null);
      }
      setAuthLoading(false); 
    };

    checkRefresh();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const signup = async (name, email, password) => {
    const res = await api.post("/auth/signup", { name, email, password });
    setAccessToken(res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  };

  const refreshAccessToken = async () => {
    const res = await api.post("/auth/refresh");
    setAccessToken(res.data.accessToken);
    return res.data.accessToken;
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        setUser,
        login,
        signup,
        logout,
        refreshAccessToken,
        authLoading, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
