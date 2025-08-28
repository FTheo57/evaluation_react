import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import ConferenceForm from "../components/forms/ConferenceForm";
import Loading from "../components/Loading";
import Error from "../components/Error";

const AdminConferencesPage = () => {
  const { user } = useAuth();
  const [conferences, setConferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingConference, setEditingConference] = useState(null);

  const loadConferences = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getConferences();
      setConferences(data || []);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConferences();
  }, []);

  const handleCreateSuccess = () => {
    setShowForm(false);
    loadConferences();
  };

  const handleEdit = (conference) => {
    setEditingConference(conference);
    setShowForm(true);
  };

  const handleDelete = async (conferenceId) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette conférence ?")
    ) {
      try {
        await apiService.deleteConference(conferenceId, user.token);
        loadConferences();
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingConference(null);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="admin-conferences-page">
      <h1>Administration - Gestion des Conférences</h1>

      <div className="admin-actions">
        <button onClick={() => setShowForm(true)} className="btn-primary">
          Créer une nouvelle conférence
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <ConferenceForm
              conference={editingConference}
              onSuccess={handleCreateSuccess}
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}

      <div className="conferences-management">
        <h2>Liste des conférences ({conferences.length})</h2>

        {conferences.length === 0 ? (
          <p>Aucune conférence trouvée.</p>
        ) : (
          <div className="conferences-grid">
            {conferences.map((conference) => (
              <div
                key={conference.id}
                className="conference-card admin"
                style={{
                  "--main-color": conference.design?.mainColor || "#667eea",
                  "--second-color": conference.design?.secondColor || "#764ba2",
                }}
              >
                <div className="conference-header">
                  <h3>{conference.title}</h3>
                  <p className="conference-date">{conference.date}</p>
                </div>

                <div className="conference-content">
                  <p className="description">{conference.description}</p>
                  {conference.duration && (
                    <p className="duration">
                      <strong>Durée :</strong> {conference.duration}
                    </p>
                  )}
                </div>

                <div className="conference-footer">
                  <div className="conference-actions">
                    <button
                      onClick={() => handleEdit(conference)}
                      className="btn-edit"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(conference.id)}
                      className="btn-delete"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminConferencesPage;
