import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function WorkerRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  const decoded = jwtDecode(token);

  if (decoded.role !== "worker") {
    return <Navigate to="/" />;
  }

  return children;
}

export default WorkerRoute;