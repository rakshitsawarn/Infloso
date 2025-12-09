import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useAxiosAuth from "../api/axiosAuth";
import { useEffect, useState } from "react";
import api from "../api/axios"; 

const HomePage = () => {
  const { accessToken, refreshAccessToken, user, setUser, logout } = useAuth();
  const axiosAuth = useAxiosAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        if (!accessToken) {          
          await api.post("/auth/refresh");
          await refreshAccessToken(); // updates context
        }
        const res = await axiosAuth.get("/me");
        setMe(res.data.user);
        setUser(res.data.user);
        setLoading(false);
      } catch (err) {
        console.log("Auth failed, redirecting...", err);
      }
    };

    verifyLogin();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading)
    return <p className="mt-10 text-center text-gray-600">Checking session...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-center">Welcome 🎉</h1>

        <div className="p-4 mb-4 border rounded-md bg-gray-50">
          <p className="text-lg font-medium text-gray-800">Logged in as:</p>
          <p className="mt-1 text-gray-700">{user?.name}</p>
          <p className="text-gray-700">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 mt-5 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
