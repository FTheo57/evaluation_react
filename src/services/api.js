const API_BASE_URL = "http://localhost:4555";

export const apiService = {
  // Authentification
  async signup(id, password) {
    try {
      console.log("Tentative d'inscription:", { id, password });

      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      console.log("Réponse API:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erreur API:", errorData);
        throw new Error(
          `Erreur lors de l'inscription: ${response.status} - ${errorData}`
        );
      }

      const result = await response.json();
      console.log("Résultat inscription:", result);
      return result;
    } catch (error) {
      console.error("Erreur complète:", error);
      throw new Error(error.message);
    }
  },

  async signin(id, password) {
    try {
      console.log("Tentative de connexion:", { id });

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      console.log(
        "Réponse API connexion:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erreur API connexion:", errorData);
        throw new Error(
          `Identifiants incorrects: ${response.status} - ${errorData}`
        );
      }

      const result = await response.json();
      console.log("Résultat connexion:", result);
      return result;
    } catch (error) {
      console.error("Erreur connexion complète:", error);
      throw new Error(error.message);
    }
  },

  async verifyAdmin(token) {
    try {
      console.log("Vérification du statut admin");

      const response = await fetch(`${API_BASE_URL}/verify-admin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log(
        "Réponse API verify admin:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la vérification du statut admin");
      }

      const result = await response.json();
      console.log("Résultat verify admin:", result);
      return result;
    } catch (error) {
      console.error("Erreur verify admin:", error);
      throw error;
    }
  },

  // Conférences
  async getConferences() {
    try {
      const response = await fetch(`${API_BASE_URL}/conferences`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des conférences");
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getConference(id) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/conference/${encodeURIComponent(id)}`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la conférence");
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async createConference(conferenceData, token) {
    try {
      const response = await fetch(`${API_BASE_URL}/conference`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(conferenceData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erreur lors de la création: ${response.status} - ${errorData}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async updateConference(id, conferenceData, token) {
    try {
      console.log(
        "URL de modification:",
        `${API_BASE_URL}/conference/${encodeURIComponent(id)}`
      );
      const response = await fetch(
        `${API_BASE_URL}/conference/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(conferenceData),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erreur lors de la modification: ${response.status} - ${errorData}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async deleteConference(id, token) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/conference/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Erreur lors de la suppression: ${response.status} - ${errorData}`
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Utilisateurs (admin seulement)
  async getUsers(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async promoteUser(userId, token) {
    try {
      console.log("Tentative de promotion de l'utilisateur:", userId);
      console.log(
        "URL:",
        `${API_BASE_URL}/usertype/${encodeURIComponent(userId)}`
      );

      const response = await fetch(
        `${API_BASE_URL}/usertype/${encodeURIComponent(userId)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newType: "admin" }),
        }
      );

      console.log(
        "Réponse API promotion:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Erreur API promotion:", errorData);
        throw new Error(
          `Erreur lors de la promotion: ${response.status} - ${errorData}`
        );
      }

      const result = await response.json();
      console.log("Résultat promotion:", result);
      return result;
    } catch (error) {
      console.error("Erreur promotion complète:", error);
      throw new Error(error.message);
    }
  },
};
