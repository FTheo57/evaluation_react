import React, { useState } from "react";
import { apiService } from "../services/api";

const SignupPage = ({ onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 3) {
      setError("Le mot de passe doit contenir au moins 3 caractères");
      setIsLoading(false);
      return;
    }

    try {
      await apiService.signup(formData.id, formData.password);
      setSuccess(
        "Inscription réussie ! Vous allez être redirigé vers la page de connexion."
      );
      setFormData({ id: "", password: "", confirmPassword: "" });

      // Redirection vers la page de connexion après 2 secondes
      setTimeout(() => {
        if (onNavigateToLogin) {
          onNavigateToLogin();
        }
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <h1>Inscription</h1>
      <p className="text-center mb-2">
        Créez votre compte pour accéder à la plateforme
      </p>

      <form onSubmit={handleSubmit} className="signup-form">
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
            placeholder="Choisissez un identifiant unique"
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
            placeholder="Minimum 3 caractères"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe :</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Répétez votre mot de passe"
          />
        </div>

        {error && <div className="error">{error}</div>}
        {success && (
          <div
            className="note"
            style={{
              background: "#d4edda",
              borderColor: "#c3e6cb",
              color: "#155724",
            }}
          >
            {success}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Inscription..." : "S'inscrire"}
          </button>
        </div>
      </form>

      <div className="note mt-2">
        <p>
          <strong>Note :</strong> Après inscription, vous devrez être promu en
          administrateur via Mongo Express pour accéder aux fonctionnalités
          d'administration.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
