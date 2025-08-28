import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";

const ConferenceDetailPage = ({ id }) => {
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConference = async () => {
      try {
        setLoading(true);
        const data = await apiService.getConference(id);
        setConference(data);
      } catch (err) {
        setError("Erreur lors du chargement de la conférence");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConference();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="conference-detail-page">
        <div className="loading">Chargement de la conférence...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conference-detail-page">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!conference) {
    return (
      <div className="conference-detail-page">
        <div className="error">Conférence non trouvée</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="conference-detail-page">
      <div
        className="conference-detail"
        style={{
          "--main-color": conference.design?.mainColor || "#007bff",
          "--second-color": conference.design?.secondColor || "#6c757d",
        }}
      >
        {/* Header avec image et titre */}
        <div className="conference-detail-header">
          <div className="conference-detail-image">
            <img
              src={conference.img}
              alt={conference.title}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/600x300/cccccc/666666?text=Image+non+disponible";
              }}
            />
          </div>
          <div className="conference-detail-title">
            <h1>{conference.title}</h1>
            <div className="conference-detail-meta">
              <span className="conference-date">
                📅 {formatDate(conference.date)}
              </span>
              {conference.duration && (
                <span className="conference-duration">
                  ⏱️ {conference.duration}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="conference-detail-content">
          {/* Description */}
          <section className="conference-section">
            <h2>Description</h2>
            <p>{conference.description}</p>
          </section>

          {/* Contenu détaillé */}
          <section className="conference-section">
            <h2>Contenu</h2>
            <p>{conference.content}</p>
          </section>

          {/* Intervenants */}
          {conference.speakers && conference.speakers.length > 0 && (
            <section className="conference-section">
              <h2>Intervenant(s)</h2>
              <div className="speakers-list">
                {conference.speakers.map((speaker, index) => (
                  <div key={index} className="speaker-card">
                    <div className="speaker-avatar">👤</div>
                    <div className="speaker-info">
                      <h3>
                        {speaker.firstname} {speaker.lastname}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Organisateurs */}
          {conference.stakeholders && conference.stakeholders.length > 0 && (
            <section className="conference-section">
              <h2>Organisateur(s)</h2>
              <div className="stakeholders-list">
                {conference.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="stakeholder-card">
                    <div className="stakeholder-avatar">
                      {stakeholder.img ? (
                        <img
                          src={stakeholder.img}
                          alt={`${stakeholder.firstname} ${stakeholder.lastname}`}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/60x60/cccccc/666666?text=👤";
                          }}
                        />
                      ) : (
                        "👤"
                      )}
                    </div>
                    <div className="stakeholder-info">
                      <h3>
                        {stakeholder.firstname} {stakeholder.lastname}
                      </h3>
                      {stakeholder.job && (
                        <p className="stakeholder-job">{stakeholder.job}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Adresse (si disponible) */}
          {conference.osMap &&
            (conference.osMap.addressl1 ||
              conference.osMap.addressl2 ||
              conference.osMap.postalCode ||
              conference.osMap.city) && (
              <section className="conference-section">
                <h2>📍 Lieu</h2>
                <div className="conference-location">
                  {conference.osMap.addressl1 && (
                    <p>{conference.osMap.addressl1}</p>
                  )}
                  {conference.osMap.addressl2 && (
                    <p>{conference.osMap.addressl2}</p>
                  )}
                  {(conference.osMap.postalCode || conference.osMap.city) && (
                    <p>
                      {conference.osMap.postalCode} {conference.osMap.city}
                    </p>
                  )}
                </div>
              </section>
            )}

          {/* Informations techniques */}
          <section className="conference-section">
            <h2>Informations</h2>
            <div className="conference-info-grid">
              <div className="info-item">
                <strong>ID :</strong> {conference.id}
              </div>
              <div className="info-item">
                <strong>Date :</strong> {formatDate(conference.date)}
              </div>
              {conference.duration && (
                <div className="info-item">
                  <strong>Durée :</strong> {conference.duration}
                </div>
              )}
              <div className="info-item">
                <strong>Intervenants :</strong>{" "}
                {conference.speakers?.length || 0}
              </div>
              <div className="info-item">
                <strong>Organisateurs :</strong>{" "}
                {conference.stakeholders?.length || 0}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ConferenceDetailPage;
