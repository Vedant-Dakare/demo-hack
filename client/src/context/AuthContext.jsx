import React from "react";
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // contains id + role
      } catch (e) {
        // Invalid/expired token; clear and keep user null
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
