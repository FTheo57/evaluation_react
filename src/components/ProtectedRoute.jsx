import React from "react";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="protected-route">
        <h2>Accès refusé</h2>
        <p>Vous devez être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="protected-route">
        <h2>Accès refusé</h2>
        <p>Vous devez être administrateur pour accéder à cette page.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
