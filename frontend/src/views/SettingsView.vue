
<script setup>
import { ref, onMounted } from 'vue'

// Paramètres par défaut
const parametresDefaut = {
  nom: 'Utilisateur COSIDER',
  email: 'utilisateur@cosider.dz',
  fonction: 'Employé',
  langue: 'fr',
  modele: 'demo',
  longueurReponse: 'moyenne',
  theme: 'clair',
  notifications: true,
  historique: true,
  tailleMax: 10,
  formats: ['PDF', 'Word', 'Excel']
}

// Variables réactives
const parametres = ref({ ...parametresDefaut })
const messageSucces = ref('')

// Charger les paramètres enregistrés
onMounted(() => {
  try {
    const sauvegarde = localStorage.getItem('cosider-settings')

    if (sauvegarde) {
      const donnees = JSON.parse(sauvegarde)

      parametres.value = {
        ...parametresDefaut,
        ...donnees
      }
    }
  } catch (erreur) {
    console.error('Erreur de chargement des paramètres', erreur)
  }
})

// Enregistrer
function enregistrerParametres() {
  try {
    localStorage.setItem(
      'cosider-settings',
      JSON.stringify(parametres.value)
    )

    messageSucces.value = 'Paramètres enregistrés avec succès !'
  } catch (erreur) {
    messageSucces.value = 'Impossible d’enregistrer les paramètres.'
  }
}

// Réinitialiser
function reinitialiserParametres() {
  if (!confirm('Réinitialiser tous les paramètres ?')) return

  parametres.value = {
    ...parametresDefaut,
    formats: [...parametresDefaut.formats]
  }

  localStorage.removeItem('cosider-settings')
  messageSucces.value = 'Paramètres réinitialisés.'
}

// Gestion des formats
function changerFormat(format) {
  const index = parametres.value.formats.indexOf(format)

  if (index === -1) {
    parametres.value.formats.push(format)
  } else {
    parametres.value.formats.splice(index, 1)
  }
}
</script>

<template>
  <div class="settings-page">

    <!-- EN-TÊTE -->
    <div class="page-header">
      <div>
        <h2>Paramètres</h2>
        <p>Personnalisez votre expérience COSIDER AI.</p>
      </div>

      <span class="demo-badge">⚙ Configuration locale</span>
    </div>

    <!-- PROFIL -->
    <section class="settings-card">
      <div class="section-title">
        <div class="section-icon">👤</div>
        <div>
          <h3>Profil utilisateur</h3>
          <p>Informations personnelles affichées dans l'application.</p>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Nom complet</label>
          <input v-model="parametres.nom" type="text" />
        </div>

        <div class="form-group">
          <label>Adresse email</label>
          <input v-model="parametres.email" type="email" />
        </div>

        <div class="form-group">
          <label>Fonction</label>
          <select v-model="parametres.fonction">
            <option>Employé</option>
            <option>Ingénieur</option>
            <option>Responsable</option>
            <option>Administrateur</option>
            <option>Stagiaire</option>
          </select>
        </div>

        <div class="form-group">
          <label>Langue</label>
          <select v-model="parametres.langue">
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      </div>
    </section>

    <!-- ASSISTANT IA -->
    <section class="settings-card">
      <div class="section-title">
        <div class="section-icon">✦</div>
        <div>
          <h3>Assistant IA</h3>
          <p>Préférences de fonctionnement de l'assistant.</p>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Modèle d'intelligence artificielle</label>
          <select v-model="parametres.modele">
            <option value="demo">Mode démonstration</option>
            <option value="local">Modèle local (futur)</option>
            <option value="cloud">Modèle cloud (futur)</option>
          </select>
        </div>

        <div class="form-group">
          <label>Longueur des réponses</label>
          <select v-model="parametres.longueurReponse">
            <option value="courte">Courte</option>
            <option value="moyenne">Moyenne</option>
            <option value="longue">Détaillée</option>
          </select>
        </div>
      </div>

      <div class="setting-row">
        <div>
          <strong>Enregistrer l'historique</strong>
          <p>Préférence pour la conservation des conversations.</p>
        </div>
        <input
          v-model="parametres.historique"
          type="checkbox"
          class="toggle"
        />
      </div>
    </section>

    <!-- APPARENCE -->
    <section class="settings-card">
      <div class="section-title">
        <div class="section-icon">🎨</div>
        <div>
          <h3>Apparence et notifications</h3>
          <p>Personnalisez les préférences visuelles.</p>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Thème de l'application</label>
          <select v-model="parametres.theme">
            <option value="clair">Clair</option>
            <option value="sombre">Sombre (futur)</option>
          </select>
        </div>
      </div>

      <div class="setting-row">
        <div>
          <strong>Notifications</strong>
          <p>Préférence pour les futures notifications.</p>
        </div>
        <input
          v-model="parametres.notifications"
          type="checkbox"
          class="toggle"
        />
      </div>
    </section>

    <!-- DOCUMENTS -->
    <section class="settings-card">
      <div class="section-title">
        <div class="section-icon">▤</div>
        <div>
          <h3>Gestion des documents</h3>
          <p>Préférences pour l'importation des documents.</p>
        </div>
      </div>

      <div class="form-group">
        <label>Taille maximale affichée</label>
        <select v-model.number="parametres.tailleMax">
          <option :value="5">5 MB</option>
          <option :value="10">10 MB</option>
          <option :value="20">20 MB</option>
          <option :value="50">50 MB</option>
        </select>
      </div>

      <div class="formats-section">
        <label>Formats autorisés (préférences)</label>

        <div class="formats-list">
          <label
            v-for="format in ['PDF', 'Word', 'Excel']"
            :key="format"
            class="format-option"
          >
            <input
              type="checkbox"
              :checked="parametres.formats.includes(format)"
              @change="changerFormat(format)"
            />
            {{ format }}
          </label>
        </div>
      </div>
    </section>

    <!-- BOUTONS -->
    <div class="settings-actions">
      <button class="reset-btn" @click="reinitialiserParametres">
        Réinitialiser
      </button>

      <button class="save-btn" @click="enregistrerParametres">
        ✓ Enregistrer les paramètres
      </button>
    </div>

    <p v-if="messageSucces" class="success-message">
      {{ messageSucces }}
    </p>

    <p class="demo-note">
      Les paramètres sont enregistrés uniquement dans ce navigateur.
      Les options futures ne modifient pas encore les autres pages.
    </p>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: #273441;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 700;
}

.page-header p {
  color: #87939e;
  font-size: 13px;
  margin-top: 6px;
}

.demo-badge {
  background: #f8eadf;
  color: #a65e32;
  border-radius: 25px;
  padding: 9px 14px;
  font-size: 12px;
  font-weight: 600;
}

.settings-card {
  background: white;
  border: 1px solid #e6e9ed;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(20,30,40,.025);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 25px;
}

.section-icon {
  width: 44px;
  height: 44px;
  background: #f7e9df;
  color: #b76b43;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 21px;
}

.section-title h3 {
  font-size: 17px;
  font-weight: 700;
}

.section-title p {
  font-size: 13px;
  color: #87939e;
  margin-top: 5px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.form-group label,
.formats-section > label {
  font-size: 13px;
  font-weight: 600;
  color: #56636d;
}

.form-group input,
.form-group select {
  border: 1px solid #dce2e7;
  border-radius: 9px;
  padding: 12px;
  background: white;
  outline: none;
  font-size: 13px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #b76b43;
}

.setting-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  border-top: 1px solid #edf0f2;
  padding-top: 22px;
  margin-top: 22px;
}

.setting-row strong {
  font-size: 13px;
}

.setting-row p {
  color: #87939e;
  font-size: 12px;
  margin-top: 6px;
}

.toggle {
  width: 19px;
  height: 19px;
  accent-color: #b76b43;
  cursor: pointer;
}

.formats-section {
  margin-top: 24px;
}

.formats-list {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 15px;
}

.format-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f8f9fa;
  border: 1px solid #edf0f2;
  border-radius: 9px;
  font-size: 13px;
  cursor: pointer;
}

.format-option input {
  accent-color: #b76b43;
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.reset-btn,
.save-btn {
  padding: 12px 19px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.reset-btn {
  background: white;
  border: 1px solid #dce2e7;
  color: #56636d;
}

.save-btn {
  background: #b76b43;
  color: white;
}

.save-btn:hover {
  background: #975331;
}

.success-message {
  background: #e7f6ed;
  color: #278353;
  padding: 13px;
  border-radius: 9px;
  font-size: 13px;
  text-align: center;
}

.demo-note {
  font-size: 12px;
  color: #9aa4ad;
  text-align: center;
}

@media (max-width: 650px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .settings-card {
    padding: 18px;
  }

  .settings-actions {
    flex-direction: column;
  }

  .reset-btn,
  .save-btn {
    width: 100%;
  }
}
</style>
