import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";
import Loading from "../components/Loading";
import Error from "../components/Error";

const HomePage = ({ onNavigateToConference }) => {
  const [conferences, setConferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleConferenceClick = (conferenceId) => {
    if (onNavigateToConference) {
      onNavigateToConference(conferenceId);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div className="home-page">
      <h1>Bienvenue sur la plateforme de conférences</h1>
      <p>Découvrez toutes nos conférences disponibles</p>

      <div className="conferences-section">
        <h2>Liste des conférences ({conferences.length})</h2>

        {conferences.length === 0 ? (
          <p>Aucune conférence disponible pour le moment.</p>
        ) : (
          <div className="conferences-grid">
            {conferences.map((conference) => (
              <div
                key={conference.id}
                className="conference-card"
                onClick={() => handleConferenceClick(conference.id)}
                style={{
                  cursor: "pointer",
                  border: `3px solid ${
                    conference.design?.mainColor || "#007bff"
                  }`,
                }}
              >
                <div
                  className="conference-header"
                  style={{
                    backgroundColor: conference.design?.mainColor || "#007bff",
                    color: conference.design?.secondColor || "#ffffff",
                  }}
                >
                  <h3>{conference.title}</h3>
                  <p className="date">{conference.date}</p>
                </div>

                <div className="conference-content">
                  <img
                    src={conference.img}
                    alt={conference.title}
                    className="conference-image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Image+non+disponible";
                    }}
                  />
                  <p className="description">{conference.description}</p>
                  {conference.duration && (
                    <p className="duration">
                      <strong>Durée :</strong> {conference.duration}
                    </p>
                  )}
                  {conference.speakers && conference.speakers.length > 0 && (
                    <p className="speaker">
                      <strong>Intervenant :</strong>{" "}
                      {conference.speakers[0].firstname}{" "}
                      {conference.speakers[0].lastname}
                    </p>
                  )}
                </div>

                <div className="conference-footer">
                  <button className="btn-details">Voir les détails</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
