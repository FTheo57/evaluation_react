import React, { useState } from "react";
import "./App.css";

// Import des pages
import HomePage from "./pages/HomePage";
import ConferenceDetailPage from "./pages/ConferenceDetailPage";
import LoginPage from "./pages/LoginPage";
import AdminConferencesPage from "./pages/AdminConferencesPage";
import AdminUsersPage from "./pages/AdminUsersPage";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedConferenceId, setSelectedConferenceId] = useState(null);

  const navigateTo = (page, conferenceId = null) => {
    setCurrentPage(page);
    if (conferenceId) {
      setSelectedConferenceId(conferenceId);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "conference":
        return <ConferenceDetailPage id={selectedConferenceId} />;
      case "login":
        return <LoginPage />;
      case "admin-conferences":
        return <AdminConferencesPage />;
      case "admin-users":
        return <AdminUsersPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <nav className="simple-navigation">
        <button onClick={() => navigateTo("home")}>Accueil</button>
        <button onClick={() => navigateTo("login")}>Connexion</button>
        <button onClick={() => navigateTo("admin-conferences")}>
          Admin Conférences
        </button>
        <button onClick={() => navigateTo("admin-users")}>
          Admin Utilisateurs
        </button>
      </nav>

      <main>{renderCurrentPage()}</main>
    </div>
  );
}

export default App;
