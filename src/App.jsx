import React, { useState } from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Import des pages
import HomePage from "./pages/HomePage";
import ConferenceDetailPage from "./pages/ConferenceDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminConferencesPage from "./pages/AdminConferencesPage";
import AdminUsersPage from "./pages/AdminUsersPage";

function AppContent() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedConferenceId, setSelectedConferenceId] = useState(null);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

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
      case "signup":
        return <SignupPage />;
      case "admin-conferences":
        return (
          <ProtectedRoute requireAdmin={true}>
            <AdminConferencesPage />
          </ProtectedRoute>
        );
      case "admin-users":
        return (
          <ProtectedRoute requireAdmin={true}>
            <AdminUsersPage />
          </ProtectedRoute>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <nav className="simple-navigation">
        <button onClick={() => navigateTo("home")}>Accueil</button>
        {!isAuthenticated() ? (
          <>
            <button onClick={() => navigateTo("login")}>Connexion</button>
            <button onClick={() => navigateTo("signup")}>Inscription</button>
          </>
        ) : (
          <>
            <span>Connecté: {user?.id}</span>
            <button onClick={logout}>Déconnexion</button>
            {isAdmin() && (
              <>
                <button onClick={() => navigateTo("admin-conferences")}>
                  Admin Conférences
                </button>
                <button onClick={() => navigateTo("admin-users")}>
                  Admin Utilisateurs
                </button>
              </>
            )}
          </>
        )}
      </nav>

      <main>{renderCurrentPage()}</main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
