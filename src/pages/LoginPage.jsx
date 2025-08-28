import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!id || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const result = await login(id, password);
    if (!result.success) {
      setError(result.error || "Erreur de connexion");
    }
  };

  return (
    <div className="login-page">
      <h1>Connexion</h1>
      <p>Connectez-vous pour accéder à votre compte</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Identifiant :</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Votre identifiant"
            disabled={isLoading}
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            disabled={isLoading}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="login-info">
        <p>
          <strong>Note :</strong> Utilisez les identifiants que vous avez créés
          via la page d'inscription.
        </p>
        <p>
          Pour promouvoir un utilisateur en admin, modifiez manuellement le
          champ "type" dans Mongo Express.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
