
<script setup>
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'cosider-ai-settings'

const valeursInitiales = {
  nom: 'Utilisateur COSIDER',
  fonction: 'Collaborateur',
  email: '',
  langue: 'fr',
  notifications: true,
  animations: true,
  confirmationSuppression: true
}

function chargerParametres() {
  try {
    const sauvegarde = localStorage.getItem(STORAGE_KEY)

    if (!sauvegarde) {
      return { ...valeursInitiales }
    }

    const donnees = JSON.parse(sauvegarde)

    return {
      ...valeursInitiales,
      ...donnees
    }
  } catch {
    return { ...valeursInitiales }
  }
}

const parametres = ref(chargerParametres())
const sauvegardeReussie = ref(false)
const ongletActif = ref('profil')

const onglets = [
  { id: 'profil', nom: 'Mon profil', icone: '◉' },
  { id: 'preferences', nom: 'Préférences', icone: '⚙' },
  { id: 'donnees', nom: 'Données locales', icone: '▤' },
  { id: 'apropos', nom: 'À propos', icone: 'ⓘ' }
]

const initiales = computed(() => {
  const mots = parametres.value.nom.trim().split(/\s+/)

  return mots
    .slice(0, 2)
    .map(mot => mot.charAt(0).toUpperCase())
    .join('') || 'CA'
})

watch(
  () => parametres.value.animations,
  valeur => {
    document.documentElement.classList.toggle(
      'cosider-reduced-motion',
      !valeur
    )
  },
  { immediate: true }
)

function sauvegarder() {
  sauvegardeReussie.value = false

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(parametres.value)
    )

    sauvegardeReussie.value = true
  } catch {
    alert('Impossible de sauvegarder les paramètres dans ce navigateur.')
  }
}

function reinitialiserParametres() {
  if (!confirm('Réinitialiser tous les paramètres ?')) return

  parametres.value = { ...valeursInitiales }
  sauvegarder()
}

function supprimerHistorique() {
  if (
    !confirm(
      'Supprimer toutes les notes enregistrées dans l’historique local ?'
    )
  ) {
    return
  }

  localStorage.removeItem('cosider-ai-history')
  alert('Les notes locales ont été supprimées.')
}
</script>

<template>
  <div class="settings-page cosider-fade-in">

    <!-- EN-TÊTE -->
    <div class="page-heading">
      <div>
        <span class="eyebrow">COSIDER AI · WORKSPACE SETTINGS</span>

        <h1>Paramètres <span>de l'espace.</span></h1>

        <p>
          Personnalisez votre environnement de travail
          et gérez les préférences de COSIDER AI.
        </p>
      </div>

      <div class="heading-icon">⚙</div>
    </div>

    <!-- BANNIÈRE -->
    <section class="settings-banner">
      <div class="banner-content">
        <span class="banner-label">PERSONAL WORKSPACE</span>

        <h2>
          Un espace de travail<br />
          <span>à votre image.</span>
        </h2>

        <p>
          Configurez votre expérience COSIDER AI
          dans une interface simple, élégante et organisée.
        </p>
      </div>

      <div class="banner-art" aria-hidden="true">
        <div class="art-circle"></div>
        <div class="art-settings">⚙</div>
      </div>
    </section>

    <!-- CONTENU -->
    <div class="settings-layout">

      <!-- MENU -->
      <aside class="settings-sidebar">
        <div class="sidebar-title">CONFIGURATION</div>

        <button
          v-for="onglet in onglets"
          :key="onglet.id"
          class="sidebar-item"
          :class="{ active: ongletActif === onglet.id }"
          @click="ongletActif = onglet.id"
        >
          <span class="sidebar-icon">{{ onglet.icone }}</span>
          {{ onglet.nom }}
          <span class="sidebar-arrow">›</span>
        </button>

        <div class="sidebar-divider"></div>

        <div class="sidebar-help">
          <div class="help-icon">✦</div>
          <strong>COSIDER AI</strong>
          <p>
            Votre plateforme d'intelligence documentaire.
          </p>
          <small>Version de développement</small>
        </div>
      </aside>

      <!-- PANNEAU -->
      <main class="settings-panel">

        <!-- PROFIL -->
        <section v-if="ongletActif === 'profil'">
          <div class="panel-heading">
            <span class="section-kicker">ACCOUNT PROFILE</span>
            <h2>Mon profil</h2>
            <p>Personnalisez les informations affichées dans cet espace.</p>
          </div>

          <div class="profile-preview">
            <div class="profile-avatar">{{ initiales }}</div>

            <div>
              <strong>{{ parametres.nom || 'Utilisateur COSIDER' }}</strong>
              <span>{{ parametres.fonction || 'Collaborateur' }}</span>
              <small>Profil local · COSIDER AI</small>
            </div>

            <div class="profile-badge">PROFIL</div>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label>Nom affiché</label>
              <input
                v-model="parametres.nom"
                type="text"
                maxlength="80"
                placeholder="Votre nom"
              />
            </div>

            <div class="form-field">
              <label>Fonction</label>
              <input
                v-model="parametres.fonction"
                type="text"
                maxlength="80"
                placeholder="Votre fonction"
              />
            </div>

            <div class="form-field full-width">
              <label>Adresse e-mail (facultative)</label>
              <input
                v-model="parametres.email"
                type="email"
                placeholder="exemple@entreprise.dz"
              />
              <small>
                Information stockée uniquement dans ce navigateur.
                Aucun compte utilisateur n'est encore connecté.
              </small>
            </div>
          </div>

          <div class="panel-actions">
            <button class="save-button" @click="sauvegarder">
              ✓ Enregistrer les modifications
            </button>
          </div>
        </section>

        <!-- PRÉFÉRENCES -->
        <section v-else-if="ongletActif === 'preferences'">
          <div class="panel-heading">
            <span class="section-kicker">WORKSPACE PREFERENCES</span>
            <h2>Préférences</h2>
            <p>Adaptez certains comportements de l'interface.</p>
          </div>

          <div class="preference-list">

            <div class="preference-item">
              <div class="preference-icon">◎</div>

              <div class="preference-info">
                <strong>Langue de l'interface</strong>
                <p>
                  Langue préférée enregistrée pour une future
                  prise en charge multilingue.
                </p>
              </div>

              <select v-model="parametres.langue">
                <option value="fr">Français</option>
                <option value="en">English (à venir)</option>
                <option value="ar">العربية (à venir)</option>
              </select>
            </div>

            <div class="preference-item">
              <div class="preference-icon">✦</div>

              <div class="preference-info">
                <strong>Animations de l'interface</strong>
                <p>
                  Activer ou réduire les animations visuelles.
                </p>
              </div>

              <label class="toggle">
                <input
                  v-model="parametres.animations"
                  type="checkbox"
                />
                <span class="toggle-track"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-icon">◉</div>

              <div class="preference-info">
                <strong>Notifications</strong>
                <p>
                  Préférence enregistrée pour les futures
                  notifications de la plateforme.
                </p>
              </div>

              <label class="toggle">
                <input
                  v-model="parametres.notifications"
                  type="checkbox"
                />
                <span class="toggle-track"></span>
              </label>
            </div>

            <div class="preference-item">
              <div class="preference-icon">▤</div>

              <div class="preference-info">
                <strong>Confirmation des suppressions</strong>
                <p>
                  Préférence prévue pour les futures opérations
                  de suppression.
                </p>
              </div>

              <label class="toggle">
                <input
                  v-model="parametres.confirmationSuppression"
                  type="checkbox"
                />
                <span class="toggle-track"></span>
              </label>
            </div>

          </div>

          <div class="panel-actions">
            <button class="save-button" @click="sauvegarder">
              ✓ Enregistrer les préférences
            </button>
          </div>
        </section>

        <!-- DONNÉES -->
        <section v-else-if="ongletActif === 'donnees'">
          <div class="panel-heading">
            <span class="section-kicker">LOCAL DATA MANAGEMENT</span>
            <h2>Données locales</h2>
            <p>
              Gérez les informations enregistrées
              dans votre navigateur.
            </p>
          </div>

          <div class="data-card">
            <div class="data-icon">◷</div>

            <div class="data-info">
              <strong>Historique local</strong>
              <p>
                Supprimer les notes créées dans la page Historique.
                Cette action ne supprime aucun fichier du serveur.
              </p>
            </div>

            <button class="danger-button" @click="supprimerHistorique">
              Supprimer
            </button>
          </div>

          <div class="data-card">
            <div class="data-icon">⚙</div>

            <div class="data-info">
              <strong>Réinitialiser les paramètres</strong>
              <p>
                Restaurer les valeurs par défaut du profil
                et des préférences de cette page.
              </p>
            </div>

            <button
              class="outline-button"
              @click="reinitialiserParametres"
            >
              Réinitialiser
            </button>
          </div>

          <div class="security-note">
            <div class="security-symbol">ⓘ</div>

            <div>
              <strong>À propos de vos données</strong>
              <p>
                Les préférences et notes sont conservées dans
                le stockage local du navigateur. Les PDF importés
                depuis la page Documents sont envoyés au backend
                FastAPI et ne sont pas supprimés ici.
              </p>
            </div>
          </div>
        </section>

        <!-- À PROPOS -->
        <section v-else-if="ongletActif === 'apropos'">
          <div class="panel-heading">
            <span class="section-kicker">PLATFORM INFORMATION</span>
            <h2>À propos de COSIDER AI</h2>
            <p>
              Découvrez les informations de votre plateforme.
            </p>
          </div>

          <div class="about-hero">
            <div class="about-logo">C.</div>

            <div>
              <h3>COSIDER <span>AI</span></h3>
              <p>Document Intelligence Platform</p>
            </div>
          </div>

          <div class="about-description">
            COSIDER AI est un projet de plateforme documentaire
            visant à centraliser les fichiers et à intégrer
            progressivement des fonctionnalités d'intelligence
            artificielle pour faciliter l'accès à l'information.
          </div>

          <div class="info-list">
            <div class="info-row">
              <span>Nom du projet</span>
              <strong>COSIDER AI</strong>
            </div>

            <div class="info-row">
              <span>Version de l'interface</span>
              <strong>1.0 · Développement</strong>
            </div>

            <div class="info-row">
              <span>Frontend</span>
              <strong>Vue.js 3</strong>
            </div>

            <div class="info-row">
              <span>Backend</span>
              <strong>Python · FastAPI</strong>
            </div>

            <div class="info-row">
              <span>Fonctionnalité connectée</span>
              <strong>Importation PDF</strong>
            </div>

            <div class="info-row">
              <span>Intelligence artificielle</span>
              <strong>Intégration à venir</strong>
            </div>
          </div>

          <div class="about-footer">
            <span>✦</span>
            Conçu pour évoluer vers une plateforme
            documentaire intelligente.
          </div>
        </section>

        <!-- CONFIRMATION -->
        <div
          v-if="sauvegardeReussie && ['profil', 'preferences'].includes(ongletActif)"
          class="success-message"
          role="status"
        >
          ✓ Paramètres enregistrés dans ce navigateur.
        </div>

      </main>
    </div>

    <footer class="page-footer">
      COSIDER AI · Configuration de l'espace de travail
    </footer>

  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 25px;
  color: #202634;
}

.page-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.eyebrow,
.section-kicker {
  color: #b51226;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.page-heading h1 {
  font-size: clamp(27px, 3vw, 36px);
  font-weight: 800;
  margin: 10px 0;
}

.page-heading h1 span {
  color: #b51226;
}

.page-heading p {
  color: #9199a7;
  font-size: 12px;
  line-height: 1.8;
  margin: 0;
}

.heading-icon {
  width: 57px;
  height: 57px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: #fff0f2;
  color: #b51226;
  border: 1px solid #f4d6dc;
  font-size: 29px;
}

.settings-banner {
  min-height: 230px;
  padding: 35px 42px;
  border-radius: 21px;
  background: linear-gradient(115deg, #990d20, #c21a33 62%, #e64a60);
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.banner-content {
  position: relative;
  z-index: 2;
}

.banner-label {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #ffd9df;
}

.banner-content h2 {
  font-size: clamp(27px, 3vw, 38px);
  line-height: 1.3;
  margin: 15px 0 12px;
}

.banner-content h2 span {
  color: #ffd5dd;
}

.banner-content p {
  max-width: 470px;
  font-size: 12px;
  color: #ffe4e9;
  line-height: 1.9;
}

.banner-art {
  position: absolute;
  right: 90px;
  width: 240px;
  height: 240px;
  display: grid;
  place-items: center;
}

.art-circle {
  width: 220px;
  height: 220px;
  border: 1px solid rgba(255,255,255,.25);
  border-radius: 50%;
  box-shadow: 0 0 0 35px rgba(255,255,255,.04);
}

.art-settings {
  position: absolute;
  width: 112px;
  height: 112px;
  border-radius: 28px;
  background: rgba(255,255,255,.2);
  border: 1px solid rgba(255,255,255,.4);
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  font-size: 65px;
  box-shadow: 0 15px 35px rgba(70,0,15,.2);
}

.settings-layout {
  display: grid;
  grid-template-columns: 245px minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.settings-sidebar,
.settings-panel {
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 18px;
  box-shadow: 0 8px 30px rgba(30,35,50,.025);
}

.settings-sidebar {
  padding: 17px 12px;
}

.sidebar-title {
  padding: 12px 13px 17px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
  color: #a0a7b2;
}

.sidebar-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 12px;
  margin-bottom: 5px;
  border: none;
  border-radius: 10px;
  background: transparent;
  text-align: left;
  color: #7f8998;
  font-size: 12px;
  font-weight: 700;
  transition: all .2s;
}

.sidebar-item:hover {
  background: #fff7f8;
  color: #b51226;
}

.sidebar-item.active {
  background: #fff0f2;
  color: #b51226;
}

.sidebar-icon {
  width: 23px;
  font-size: 19px;
  text-align: center;
}

.sidebar-arrow {
  margin-left: auto;
  font-size: 20px;
}

.sidebar-divider {
  height: 1px;
  background: #edf0f3;
  margin: 18px 8px;
}

.sidebar-help {
  padding: 17px 14px;
  border-radius: 13px;
  background: #fff7f8;
  border: 1px solid #f7e2e6;
}

.help-icon {
  color: #b51226;
  font-size: 25px;
  margin-bottom: 10px;
}

.sidebar-help strong {
  font-size: 12px;
}

.sidebar-help p {
  color: #939baa;
  font-size: 11px;
  line-height: 1.7;
}

.sidebar-help small {
  color: #b51226;
  font-size: 10px;
  font-weight: 700;
}

.settings-panel {
  min-height: 520px;
  padding: 28px;
}

.panel-heading h2 {
  font-size: 22px;
  margin: 9px 0 0;
}

.panel-heading p {
  color: #9199a7;
  font-size: 12px;
  line-height: 1.8;
  margin: 7px 0 0;
}

.profile-preview {
  margin-top: 26px;
  padding: 21px;
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid #f2dfe3;
  background: #fff9fa;
  border-radius: 14px;
}

.profile-avatar {
  width: 62px;
  height: 62px;
  flex-shrink: 0;
  border-radius: 17px;
  background: linear-gradient(135deg, #d51d36, #9c0d21);
  color: white;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 800;
}

.profile-preview > div:nth-child(2) {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.profile-preview strong {
  font-size: 14px;
  overflow-wrap: anywhere;
}

.profile-preview span {
  font-size: 11px;
  color: #808a99;
}

.profile-preview small {
  font-size: 10px;
  color: #a1a8b3;
}

.profile-badge {
  margin-left: auto;
  padding: 7px 10px;
  border-radius: 30px;
  background: white;
  color: #b51226;
  font-size: 10px;
  font-weight: 800;
}

.form-grid {
  margin-top: 27px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 11px;
  font-weight: 800;
  color: #4a5464;
}

.form-field input {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #e5e8ee;
  border-radius: 10px;
  background: #fafbfc;
  color: #293241;
  font-size: 12px;
  outline: none;
}

.form-field input:focus {
  border-color: #b51226;
  background: white;
}

.form-field small {
  color: #a1a8b3;
  font-size: 10px;
  line-height: 1.7;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 22px;
  border-top: 1px solid #edf0f3;
}

.save-button {
  padding: 13px 19px;
  border: none;
  border-radius: 10px;
  background: #b51226;
  color: white;
  font-size: 12px;
  font-weight: 800;
}

.save-button:hover {
  background: #961023;
}

.preference-list {
  margin-top: 24px;
}

.preference-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 0;
  border-bottom: 1px solid #edf0f3;
}

.preference-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #fff0f2;
  color: #b51226;
  display: grid;
  place-items: center;
  font-size: 22px;
}

.preference-info {
  flex: 1;
}

.preference-info strong {
  font-size: 12px;
}

.preference-info p {
  color: #969eaa;
  font-size: 11px;
  line-height: 1.7;
  margin: 6px 0 0;
}

.preference-item select {
  padding: 10px;
  border: 1px solid #e6e8ee;
  border-radius: 9px;
  background: #fafbfc;
  color: #586373;
  font-size: 11px;
  max-width: 160px;
}

.toggle {
  position: relative;
  width: 43px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-track {
  position: absolute;
  inset: 0;
  background: #d9dde5;
  border-radius: 30px;
  transition: background .2s;
}

.toggle-track::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  top: 3px;
  left: 3px;
  border-radius: 50%;
  background: white;
  transition: transform .2s;
}

.toggle input:checked + .toggle-track {
  background: #b51226;
}

.toggle input:checked + .toggle-track::before {
  transform: translateX(19px);
}

.data-card {
  margin-top: 21px;
  padding: 19px;
  border: 1px solid #e9ebf0;
  border-radius: 13px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.data-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #fff0f2;
  color: #b51226;
  display: grid;
  place-items: center;
  font-size: 23px;
}

.data-info {
  flex: 1;
}

.data-info strong {
  font-size: 12px;
}

.data-info p {
  color: #939baa;
  font-size: 11px;
  line-height: 1.8;
  margin: 6px 0 0;
}

.danger-button,
.outline-button {
  padding: 10px 13px;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.danger-button {
  border: none;
  background: #fff0f2;
  color: #b51226;
}

.outline-button {
  border: 1px solid #e7e9ef;
  background: white;
  color: #657081;
}

.security-note {
  display: flex;
  gap: 13px;
  margin-top: 27px;
  padding: 18px;
  border-radius: 12px;
  border: 1px solid #f5e6c9;
  background: #fffbf2;
}

.security-symbol {
  color: #b7862c;
  font-size: 22px;
}

.security-note strong {
  font-size: 12px;
}

.security-note p {
  color: #8d8d87;
  font-size: 11px;
  line-height: 1.8;
  margin: 7px 0 0;
}

.about-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 27px;
  padding: 24px;
  border-radius: 14px;
  background: #fff7f8;
  border: 1px solid #f4dce1;
}

.about-logo {
  width: 67px;
  height: 67px;
  border-radius: 18px;
  background: #b51226;
  color: white;
  display: grid;
  place-items: center;
  font-size: 31px;
  font-weight: 800;
}

.about-hero h3 {
  font-size: 25px;
  margin: 0;
}

.about-hero h3 span {
  color: #b51226;
}

.about-hero p {
  font-size: 11px;
  color: #939baa;
  margin: 7px 0 0;
}

.about-description {
  color: #7d8796;
  font-size: 12px;
  line-height: 1.9;
  margin: 22px 0;
}

.info-list {
  border: 1px solid #eaecf1;
  border-radius: 13px;
  overflow: hidden;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 15px 17px;
  border-bottom: 1px solid #edf0f3;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row span {
  color: #929baa;
  font-size: 11px;
}

.info-row strong {
  color: #364151;
  font-size: 11px;
  text-align: right;
}

.about-footer {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-top: 23px;
  padding: 16px;
  border-radius: 11px;
  background: #fff0f2;
  color: #a54151;
  font-size: 11px;
  font-weight: 700;
}

.about-footer span {
  font-size: 23px;
}

.success-message {
  margin-top: 20px;
  padding: 13px 15px;
  background: #eaf8f0;
  border-radius: 10px;
  color: #168452;
  font-size: 12px;
  font-weight: 700;
}

.page-footer {
  text-align: center;
  color: #a1a8b3;
  font-size: 10px;
}

:global(.cosider-reduced-motion *),
:global(.cosider-reduced-motion *::before),
:global(.cosider-reduced-motion *::after) {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}

@media (max-width: 1100px) {
  .banner-art {
    opacity: .4;
    right: -20px;
  }
}

@media (max-width: 850px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }

  .settings-sidebar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .sidebar-title,
  .sidebar-divider,
  .sidebar-help {
    display: none;
  }

  .sidebar-item {
    width: auto;
    margin: 0;
  }

  .sidebar-arrow {
    display: none;
  }

  .banner-art {
    display: none;
  }
}

@media (max-width: 600px) {
  .settings-banner {
    padding: 29px 23px;
  }

  .settings-panel {
    padding: 19px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .preference-item,
  .data-card {
    flex-wrap: wrap;
  }

  .profile-badge {
    display: none;
  }
}
</style>
