// ============================================================
// src/context/AuthContext.jsx
// Authentication Context (MongoDB + JWT)
// ============================================================

import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { authService } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Logged in user
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("gadgetzone_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // JWT Token
  const [token, setToken] = useState(() => {
    return localStorage.getItem("gadgetzone_token") || "";
  });

  // Error Message
  const [authError, setAuthError] = useState("");

  // =============================
  // Load Profile if token exists
  // =============================
  useEffect(() => {
    const loadProfile = async () => {
      if (!token) return;

      try {
        const profile = await authService.getProfile(token);
        setUser(profile);
      } catch (err) {
        console.error(err);

        localStorage.removeItem("gadgetzone_user");
        localStorage.removeItem("gadgetzone_token");

        setUser(null);
        setToken("");
      }
    };

    loadProfile();
  }, [token]);

  // =============================
  // Save User + Token
  // =============================
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "gadgetzone_user",
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem("gadgetzone_user");
    }

    if (token) {
      localStorage.setItem(
        "gadgetzone_token",
        token
      );
    } else {
      localStorage.removeItem("gadgetzone_token");
    }
  }, [user, token]);

  // =============================
  // Login
  // =============================
  const login = async (email, password) => {
  try {
    console.log("AuthContext: login started");

    const data = await authService.login({
      email,
      password,
    });

    console.log("AuthContext: API response", data);

    // Save to localStorage
    localStorage.setItem("gadgetzone_token", data.token);
    localStorage.setItem(
      "gadgetzone_user",
      JSON.stringify(data.user)
    );

    setToken(data.token);
    setUser(data.user);

    return {
      success: true,
      user: data.user,
    };
  } catch (err) {
    console.log("FULL ERROR:", err);
    console.log("RESPONSE:", err.response);
    console.log("DATA:", err.response?.data);

    setAuthError(
      err.response?.data?.message || "Login failed"
    );

    return {
      success: false,
    };
  }
};



  // =============================
  // Register
  // =============================
  const register = async (
    name,
    email,
    password
  ) => {
    try {
      setAuthError("");

      const data = await authService.register({
        name,
        email,
        password,
      });

      return {
        success: true,
        user: data.user,
      };
    } catch (err) {
      setAuthError(
        err.response?.data?.message ||
          "Registration failed"
      );

      return {
        success: false,
      };
    }
  };

  // =============================
  // Logout
  // =============================
  const logout = () => {
    setUser(null);
    setToken("");

    localStorage.removeItem("gadgetzone_user");
    localStorage.removeItem("gadgetzone_token");
  };

  // =============================
  // Update Profile
  // =============================
  const updateProfile = (data) => {
    setUser((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateProfile,
        authError,
        setAuthError,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}