import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import Error from "../components/Error";

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getUsers(user.token);
      setUsers(data || []);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromoteUser = async (userId) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir promouvoir cet utilisateur en administrateur ?"
      )
    ) {
      try {
        await apiService.promoteUser(userId, user.token);
        // Recharger la liste des utilisateurs
        loadUsers();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="admin-users-page">
      <h1>Administration - Gestion des Utilisateurs</h1>

      <div className="users-management">
        <h2>Liste des utilisateurs ({users.length})</h2>

        {users.length === 0 ? (
          <p>Aucun utilisateur trouvé.</p>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <div className="user-header">
                  <h3>{user.id}</h3>
                  <span className={`user-type ${user.type}`}>
                    {user.type === "admin" ? "Administrateur" : "Utilisateur"}
                  </span>
                </div>

                <div className="user-content">
                  <p>
                    <strong>ID :</strong> {user._id}
                  </p>
                  <p>
                    <strong>Type :</strong> {user.type}
                  </p>
                </div>

                <div className="user-actions">
                  {user.type === "user" && (
                    <button
                      onClick={() => handlePromoteUser(user.id)}
                      className="btn-promote"
                    >
                      Promouvoir en Admin
                    </button>
                  )}
                  {user.type === "admin" && (
                    <span className="user-status">Déjà administrateur</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
