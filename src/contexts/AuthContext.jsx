import React, { createContext, useContext, useState } from "react";
import { apiService } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (id, password) => {
    setIsLoading(true);
    try {
      const response = await apiService.signin(id, password);

      // Debug: afficher la réponse complète
      console.log("Réponse complète de l'API:", response);

      // L'API retourne directement le token JWT comme une chaîne
      const token = response;

      // Vérifier le statut admin via la liste des utilisateurs
      let userType = "user"; // Par défaut
      try {
        const users = await apiService.getUsers(token);
        console.log("Liste des utilisateurs:", users);

        // Chercher l'utilisateur connecté dans la liste
        const currentUser = users.find((user) => user.id === id);
        console.log("Utilisateur actuel trouvé:", currentUser);

        if (currentUser && currentUser.type === "admin") {
          userType = "admin";
        }
      } catch (usersError) {
        console.log(
          "Erreur lors de la récupération des utilisateurs:",
          usersError
        );
        // Si la récupération échoue, on garde le type par défaut
      }

      const userData = {
        id: id,
        type: userType,
        token: token,
      };

      console.log("Utilisateur connecté:", userData);
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => {
    return user?.type === "admin";
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAdmin,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
