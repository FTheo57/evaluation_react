import React from "react";

const ConferenceDetailPage = ({ id }) => {
  return (
    <div className="conference-detail-page">
      <h1>Détails de la conférence</h1>
      <p>ID de la conférence : {id}</p>
    </div>
  );
};

export default ConferenceDetailPage;
