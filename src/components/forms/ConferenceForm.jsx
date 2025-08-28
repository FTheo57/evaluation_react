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
    // Adresse
    addressl1: conference?.osMap?.addressl1 || "",
    addressl2: conference?.osMap?.addressl2 || "",
    postalCode: conference?.osMap?.postalCode || "",
    city: conference?.osMap?.city || "",
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
          addressl1: formData.addressl1 || "",
          addressl2: formData.addressl2 || "",
          postalCode: formData.postalCode || "",
          city: formData.city || "",
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
    <div className="conference-form">
      <h2>
        {conference
          ? "Modifier la conférence"
          : "Créer une nouvelle conférence"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Titre * :</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Date * :</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Description * :</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={isLoading}
            rows="3"
          />
        </div>

        <div>
          <label>Image URL * :</label>
          <input
            type="url"
            name="img"
            value={formData.img}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label>Contenu * :</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            disabled={isLoading}
            rows="5"
          />
        </div>

        <div>
          <label>Durée :</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="ex: 2h30"
          />
        </div>

        <h3>Adresse (optionnel)</h3>
        <div>
          <label>Adresse ligne 1 :</label>
          <input
            type="text"
            name="addressl1"
            value={formData.addressl1}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Adresse ligne 2 :</label>
          <input
            type="text"
            name="addressl2"
            value={formData.addressl2}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Code postal :</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Ville :</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <h3>Intervenant (obligatoire)</h3>
        <div>
          <label>Prénom de l'intervenant * :</label>
          <input
            type="text"
            name="speakerFirstname"
            value={formData.speakerFirstname}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Nom de l'intervenant * :</label>
          <input
            type="text"
            name="speakerLastname"
            value={formData.speakerLastname}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <h3>Organisateur (obligatoire)</h3>
        <div>
          <label>Prénom de l'organisateur * :</label>
          <input
            type="text"
            name="stakeholderFirstname"
            value={formData.stakeholderFirstname}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Nom de l'organisateur * :</label>
          <input
            type="text"
            name="stakeholderLastname"
            value={formData.stakeholderLastname}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Poste de l'organisateur :</label>
          <input
            type="text"
            name="stakeholderJob"
            value={formData.stakeholderJob}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="ex: Directeur, Manager..."
          />
        </div>

        <div>
          <label>Image de l'organisateur :</label>
          <input
            type="url"
            name="stakeholderImg"
            value={formData.stakeholderImg}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <h3>Design</h3>
        <div>
          <label>Couleur principale * :</label>
          <input
            type="color"
            name="mainColor"
            value={formData.mainColor}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div>
          <label>Couleur secondaire * :</label>
          <input
            type="color"
            name="secondColor"
            value={formData.secondColor}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <p className="form-note">
          <small>* Champs obligatoires</small>
        </p>

        {error && <p className="error">{error}</p>}

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
  );
};

export default ConferenceForm;
