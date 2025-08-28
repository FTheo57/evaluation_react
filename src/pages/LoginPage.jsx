import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = ({ onNavigateToHome }) => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(formData.id, formData.password);
      if (result.success) {
        // Redirection vers l'accueil après connexion réussie
        if (onNavigateToHome) {
          onNavigateToHome();
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Connexion</h1>
      <p className="text-center mb-2">
        Connectez-vous pour accéder à votre espace personnel
      </p>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="id">Identifiant :</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Entrez votre identifiant"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Entrez votre mot de passe"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
