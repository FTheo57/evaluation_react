import React, { useState } from "react";
import { apiService } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const ConferenceForm = ({ conference = null, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: conference?.title || "",
    date: conference?.date
      ? new Date(conference.date).toISOString().split("T")[0]
      : "",
    description: conference?.description || "",
    img: conference?.img || "",
    content: conference?.content || "",
    duration: conference?.duration || "",
    mainColor: conference?.design?.mainColor || "#007bff",
    secondColor: conference?.design?.secondColor || "#6c757d",
    // Speaker obligatoire
    speakerFirstname: conference?.speakers?.[0]?.firstname || "",
    speakerLastname: conference?.speakers?.[0]?.lastname || "",
    // Stakeholder obligatoire
    stakeholderFirstname: conference?.stakeholders?.[0]?.firstname || "",
    stakeholderLastname: conference?.stakeholders?.[0]?.lastname || "",
    stakeholderJob: conference?.stakeholders?.[0]?.job || "",
    stakeholderImg: conference?.stakeholders?.[0]?.img || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation des champs obligatoires
    if (
      !formData.title ||
      !formData.date ||
      !formData.description ||
      !formData.img ||
      !formData.content ||
      !formData.speakerFirstname ||
      !formData.speakerLastname ||
      !formData.stakeholderFirstname ||
      !formData.stakeholderLastname
    ) {
      setError(
        "Veuillez remplir tous les champs obligatoires (marqués d'un *)"
      );
      setIsLoading(false);
      return;
    }

    try {
      const conferenceData = {
        title: formData.title,
        date: formData.date,
        description: formData.description,
        img: formData.img,
        content: formData.content,
        duration: formData.duration || undefined,
        design: {
          mainColor: formData.mainColor,
          secondColor: formData.secondColor,
        },
        osMap: {
          addressl1: "",
          addressl2: "",
          postalCode: "",
          city: "",
          coordinates: [],
        },
        speakers: [
          {
            firstname: formData.speakerFirstname,
            lastname: formData.speakerLastname,
          },
        ],
        stakeholders: [
          {
            firstname: formData.stakeholderFirstname,
            lastname: formData.stakeholderLastname,
            job: formData.stakeholderJob || "",
            img: formData.stakeholderImg || "",
          },
        ],
      };

      if (conference) {
        // Modification
        console.log("ID de la conférence à modifier:", conference.id);
        await apiService.updateConference(
          conference.id,
          conferenceData,
          user.token
        );
      } else {
        // Création
        await apiService.createConference(conferenceData, user.token);
      }

      onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {conference
              ? "Modifier la conférence"
              : "Créer une nouvelle conférence"}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onCancel}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="conference-form">
            <div className="form-group">
              <label htmlFor="title">Titre * :</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Titre de la conférence"
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date * :</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Durée :</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="ex: 2h30"
              />
            </div>

            <div className="form-group">
              <label htmlFor="img">Image URL * :</label>
              <input
                type="url"
                id="img"
                name="img"
                value={formData.img}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description * :</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows="2"
                placeholder="Description courte de la conférence"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="content">Contenu * :</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                disabled={isLoading}
                rows="3"
                placeholder="Contenu détaillé de la conférence"
              />
            </div>

            <h3>Intervenant (obligatoire)</h3>
            <div className="form-group">
              <label htmlFor="speakerFirstname">
                Prénom de l'intervenant * :
              </label>
              <input
                type="text"
                id="speakerFirstname"
                name="speakerFirstname"
                value={formData.speakerFirstname}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Jean"
              />
            </div>

            <div className="form-group">
              <label htmlFor="speakerLastname">Nom de l'intervenant * :</label>
              <input
                type="text"
                id="speakerLastname"
                name="speakerLastname"
                value={formData.speakerLastname}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Dupont"
              />
            </div>

            <h3>Organisateur (obligatoire)</h3>
            <div className="form-group">
              <label htmlFor="stakeholderFirstname">
                Prénom de l'organisateur * :
              </label>
              <input
                type="text"
                id="stakeholderFirstname"
                name="stakeholderFirstname"
                value={formData.stakeholderFirstname}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Marie"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stakeholderLastname">
                Nom de l'organisateur * :
              </label>
              <input
                type="text"
                id="stakeholderLastname"
                name="stakeholderLastname"
                value={formData.stakeholderLastname}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Martin"
              />
            </div>

            <div className="form-group">
              <label htmlFor="stakeholderJob">Poste de l'organisateur :</label>
              <input
                type="text"
                id="stakeholderJob"
                name="stakeholderJob"
                value={formData.stakeholderJob}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="ex: Directeur, Manager..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="stakeholderImg">Image de l'organisateur :</label>
              <input
                type="url"
                id="stakeholderImg"
                name="stakeholderImg"
                value={formData.stakeholderImg}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="https://example.com/photo.jpg"
              />
            </div>

            <h3>Design</h3>
            <div className="form-group">
              <label htmlFor="mainColor">Couleur principale * :</label>
              <input
                type="color"
                id="mainColor"
                name="mainColor"
                value={formData.mainColor}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="secondColor">Couleur secondaire * :</label>
              <input
                type="color"
                id="secondColor"
                name="secondColor"
                value={formData.secondColor}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            <p className="form-note">
              <small>* Champs obligatoires</small>
            </p>

            {error && <div className="error">{error}</div>}

            <div className="form-actions">
              <button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Enregistrement..."
                  : conference
                  ? "Modifier"
                  : "Créer"}
              </button>
              <button type="button" onClick={onCancel} disabled={isLoading}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConferenceForm;
