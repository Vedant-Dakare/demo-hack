import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; 

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
