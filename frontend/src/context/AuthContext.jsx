import { createContext, useContext, useState, useEffect } from "react";
import { apiCall } from "../api";
import { AuthApi } from "../Api.jsx";

const AuthContext = createContext(null);

const decodeJWT = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeJWT(token);
        if (decoded && decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, role) => {
    const data = await apiCall(AuthApi.Login, "POST", { email, password, role });
    const token = data?.access_token || data?.token;
    if (data && token) {
      localStorage.setItem("token", token);
      const decoded = decodeJWT(token);
      setUser(decoded || { email, role });
      return data;
    }
    throw new Error("Invalid response from auth server.");
  };

  const register = async (email, password, role) => {
    return apiCall(AuthApi.Signup, "POST", { email, password, role });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
