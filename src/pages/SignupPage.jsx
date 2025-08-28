import React, { useState } from "react";
import { apiService } from "../services/api";

const SignupPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!id || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 3) {
      setError("Le mot de passe doit contenir au moins 3 caractères");
      return;
    }

    setIsLoading(true);

    try {
      await apiService.signup(id, password);
      setSuccess(
        "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
      );
      setId("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <h1>Inscription</h1>
      <p>Créez votre compte pour accéder à la plateforme</p>

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
        <div>
          <label>Confirmer le mot de passe :</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmez votre mot de passe"
            disabled={isLoading}
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Création..." : "Créer le compte"}
        </button>
      </form>

      <div className="signup-info">
        <p>
          <strong>Note :</strong> Par défaut, les nouveaux utilisateurs sont
          créés avec le type "user".
        </p>
        <p>
          Pour promouvoir un utilisateur en admin, modifiez manuellement le
          champ "type" dans Mongo Express.
        </p>
        <p>
          <strong>Test :</strong> Si l'erreur persiste, essayez avec un autre
          identifiant (ex: "testuser123").
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
