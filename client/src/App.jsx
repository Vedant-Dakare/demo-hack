import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SubmitComplaint from "./pages/SubmitComplaint";
import AdminDashboard from "./pages/AdminDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";

import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import WorkerRoute from "./components/WorkerRoute";
import Navbar from "./components/Navbar";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <UserRoute>
              <Dashboard />
            </UserRoute>
          }
        />

        <Route
          path="/submit"
          element={
            <UserRoute>
              <SubmitComplaint />
            </UserRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

          <Route
  path="/worker"
  element={
    <WorkerRoute>
      <WorkerDashboard />
    </WorkerRoute>
  }
/>



      </Routes>
    </BrowserRouter>
  );
}


export default App;
