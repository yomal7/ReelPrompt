import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/auth/check");
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const signup = async (formData) => {
    const { data } = await axios.post("/api/auth/signup", formData);
    setUser(data);
    navigate("/dashboard");
  };

  const signin = async (formData) => {
    const { data } = await axios.post("/api/auth/signin", formData);
    setUser(data);
    navigate("/dashboard");
  };

  const logout = async () => {
    await axios.post("/api/auth/logout");
    setUser(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, signin, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
