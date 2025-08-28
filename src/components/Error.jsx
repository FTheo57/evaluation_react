import React from "react";

const Error = ({ message }) => {
  return (
    <div className="error">
      <h2>Erreur</h2>
      <p>{message}</p>
    </div>
  );
};

export default Error;
