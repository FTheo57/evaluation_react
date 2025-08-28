import React from "react";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="access-denied">
        <div className="icon">🔒</div>
        <h1>Accès refusé</h1>
        <p>Vous devez être connecté pour accéder à cette page.</p>
        <a href="/" className="btn-back">
          Retour à l'accueil
        </a>
      </div>
    );
  }

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="access-denied">
        <div className="icon">🚫</div>
        <h1>Accès refusé</h1>
        <p>Vous devez être administrateur pour accéder à cette page.</p>
        <a href="/" className="btn-back">
          Retour à l'accueil
        </a>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
