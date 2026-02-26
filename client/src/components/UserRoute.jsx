import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function UserRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  return children;
}

export default UserRoute;
