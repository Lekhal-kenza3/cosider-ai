<script setup>
import { computed, ref } from 'vue'

const API_URL = 'http://127.0.0.1:8000/api/documents/upload'
const MAX_SIZE = 10 * 1024 * 1024

const documents = ref([])
const recherche = ref('')
const filtreType = ref('Tous')
const fileInput = ref(null)
const glisserActif = ref(false)
const importEnCours = ref(false)
const progression = ref(0)
const message = ref('')
const erreur = ref('')

const documentsFiltres = computed(() =>
  documents.value.filter(doc => {
    const correspondNom = doc.nom
      .toLowerCase()
      .includes(recherche.value.toLowerCase())

    const correspondType =
      filtreType.value === 'Tous' || doc.type === filtreType.value

    return correspondNom && correspondType
  })
)

const totalPDF = computed(() =>
  documents.value.filter(doc => doc.type === 'PDF').length
)

const totalEnAttente = computed(() =>
  documents.value.filter(doc => doc.statut === 'En attente').length
)

function ouvrirImport() {
  if (!importEnCours.value) fileInput.value?.click()
}

function tailleLisible(octets) {
  return octets >= 1048576
    ? (octets / 1048576).toFixed(1) + ' Mo'
    : (octets / 1024).toFixed(1) + ' Ko'
}

function ajouterDocuments(event) {
  const fichiers = Array.from(event.target.files || [])
  importerFichiers(fichiers)
  event.target.value = ''
}

function gererDrop(event) {
  glisserActif.value = false
  importerFichiers(Array.from(event.dataTransfer.files || []))
}

async function importerFichiers(fichiers) {
  if (importEnCours.value || fichiers.length === 0) return

  erreur.value = ''
  message.value = ''
  progression.value = 0
  importEnCours.value = true

  let succes = 0

  try {
    for (let i = 0; i < fichiers.length; i++) {
      const fichier = fichiers[i]

      if (!fichier.name.toLowerCase().endsWith('.pdf')) {
        erreur.value = 'Seuls les fichiers PDF sont acceptés.'
        continue
      }

      if (fichier.size > MAX_SIZE) {
        erreur.value = `Le fichier ${fichier.name} dépasse 10 Mo.`
        continue
      }

      const formData = new FormData()
      formData.append('file', fichier)

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData
        })

        const resultat = await response.json()

        if (!response.ok) {
          throw new Error(
            typeof resultat.detail === 'string'
              ? resultat.detail
              : "Échec de l'importation"
          )
        }

        documents.value.unshift({
          id: resultat.document_id,
          nom: resultat.filename,
          type: 'PDF',
          taille: tailleLisible(resultat.size),
          categorie: 'Non classé',
          date: new Date().toLocaleDateString('fr-FR'),
          statut: 'En attente',
          fichier
        })

        succes++
      } catch (e) {
        erreur.value = `Impossible d'importer ${fichier.name} : ${e.message}`
      }

      progression.value = Math.round(
        ((i + 1) / fichiers.length) * 100
      )
    }

    if (succes > 0) {
      message.value = `${succes} document(s) importé(s) avec succès !`
    }
  } finally {
    importEnCours.value = false
  }
}

function consulterDocument(doc) {
  if (!doc.fichier) {
    alert('Le fichier n’est pas disponible dans cette session.')
    return
  }

  const url = URL.createObjectURL(doc.fichier)
  window.open(url, '_blank', 'noopener,noreferrer')
  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

function supprimerDocument(id) {
  if (confirm('Retirer ce document de la liste ?')) {
    documents.value = documents.value.filter(doc => doc.id !== id)
  }
}
</script>

<template>
  <div class="documents-page cosider-fade-in">

    <div class="page-heading">
      <div>
        <span class="eyebrow">GESTION DOCUMENTAIRE INTELLIGENTE</span>
        <h1>Centre <span>documentaire.</span></h1>
        <p>
          Centralisez vos documents et préparez-les pour
          les futures analyses intelligentes de COSIDER AI.
        </p>
      </div>

      <div class="heading-icon">▤</div>
    </div>

    <!-- BANNIÈRE -->
    <section class="intro-banner">
      <div class="banner-content">
        <span class="banner-label">COSIDER AI · DOCUMENT INTELLIGENCE</span>
        <h2>Transformez vos documents<br />en connaissances.</h2>
        <p>
          Importez vos fichiers PDF dans un espace centralisé,
          conçu pour faciliter leur consultation et leur analyse.
        </p>
      </div>

      <div class="banner-art" aria-hidden="true">
        <div class="art-ring"></div>
        <div class="art-file">
          <span>PDF</span>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="art-sparkle">✦</div>
      </div>
    </section>

    <!-- ZONE D'IMPORTATION -->
    <section class="upload-section">
      <div class="section-heading">
        <div>
          <span class="section-kicker">IMPORT CENTER</span>
          <h2>Importer des documents</h2>
          <p>Ajoutez vos PDF à votre bibliothèque documentaire.</p>
        </div>
        <span class="secure-label">● Importation locale</span>
      </div>

      <div
        class="dropzone"
        :class="{
          'drag-active': glisserActif,
          'is-uploading': importEnCours
        }"
        role="button"
        tabindex="0"
        aria-label="Sélectionner des fichiers PDF"
        @click="ouvrirImport"
        @keydown.enter.prevent="ouvrirImport"
        @keydown.space.prevent="ouvrirImport"
        @dragenter.prevent="glisserActif = true"
        @dragover.prevent="glisserActif = true"
        @dragleave.prevent="glisserActif = false"
        @drop.prevent.stop="gererDrop"
      >
        <div class="upload-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <path d="M12 16V4m0 0L7 9m5-5 5 5"/>
            <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>
          </svg>
        </div>

        <h3>Glissez vos documents ici</h3>
        <p>ou cliquez pour sélectionner vos fichiers PDF</p>

        <button
          class="upload-button"
          type="button"
          :disabled="importEnCours"
          @click.stop="ouvrirImport"
        >
          <span>＋</span>
          {{ importEnCours ? 'Importation en cours...' : 'Parcourir les fichiers' }}
        </button>

        <div class="upload-info">
          <span>PDF uniquement</span>
          <span class="info-dot"></span>
          <span>10 Mo maximum par fichier</span>
          <span class="info-dot"></span>
          <span>Importation multiple</span>
        </div>

        <input
          ref="fileInput"
          type="file"
          accept=".pdf,application/pdf"
          multiple
          hidden
          @change="ajouterDocuments"
        />
      </div>

      <div v-if="importEnCours" class="progress-panel">
        <div class="progress-heading">
          <strong>Importation des documents...</strong>
          <span>{{ progression }} %</span>
        </div>
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: progression + '%' }"
          ></div>
        </div>
        <small>Traitement des fichiers sélectionnés</small>
      </div>

      <div v-if="message" class="feedback success-feedback" role="status">
        ✓ {{ message }}
      </div>

      <div v-if="erreur" class="feedback error-feedback" role="alert">
        {{ erreur }}
      </div>
    </section>

    <!-- STATISTIQUES -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-symbol red">▤</div>
        <div>
          <span>Documents de la session</span>
          <strong>{{ documents.length }}</strong>
          <small>Importés depuis l'ouverture de la page</small>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-symbol blue">PDF</div>
        <div>
          <span>Fichiers PDF</span>
          <strong>{{ totalPDF }}</strong>
          <small>Documents disponibles dans la liste</small>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-symbol amber">◷</div>
        <div>
          <span>En attente d'analyse</span>
          <strong>{{ totalEnAttente }}</strong>
          <small>Analyse IA non encore connectée</small>
        </div>
      </div>
    </div>

    <!-- BIBLIOTHÈQUE -->
    <section class="library-panel">
      <div class="library-header">
        <div>
          <span class="section-kicker">DOCUMENT LIBRARY</span>
          <h2>Bibliothèque documentaire</h2>
          <p>{{ documentsFiltres.length }} document(s) affiché(s)</p>
        </div>

        <div class="filters">
          <input
            v-model="recherche"
            type="search"
            placeholder="Rechercher un document..."
            class="search-input"
          />

          <select v-model="filtreType" class="filter-select">
            <option>Tous</option>
            <option>PDF</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>DOCUMENT</th>
              <th>CATÉGORIE</th>
              <th>TAILLE</th>
              <th>DATE</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="doc in documentsFiltres" :key="doc.id">
              <td>
                <div class="file-cell">
                  <div class="pdf-icon">PDF</div>
                  <div>
                    <strong>{{ doc.nom }}</strong>
                    <small>Document PDF</small>
                  </div>
                </div>
              </td>

              <td>{{ doc.categorie }}</td>
              <td>{{ doc.taille }}</td>
              <td>{{ doc.date }}</td>

              <td>
                <span class="status-badge">
                  <span></span>
                  {{ doc.statut }}
                </span>
              </td>

              <td>
                <div class="row-actions">
                  <button class="view-btn" @click="consulterDocument(doc)">
                    Voir
                  </button>
                  <button class="delete-btn" @click="supprimerDocument(doc.id)">
                    Retirer
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="documentsFiltres.length === 0">
              <td colspan="6">
                <div class="empty-state">
                  <div class="empty-icon">▤</div>
                  <h3>Aucun document pour le moment</h3>
                  <p>
                    Importez votre premier PDF pour commencer
                    à constituer votre bibliothèque.
                  </p>
                  <button class="empty-button" @click="ouvrirImport">
                    + Ajouter un document
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p class="footer-note">
      Les PDF sont enregistrés par FastAPI. La liste affichée ici
      est temporaire : sa synchronisation avec le backend sera
      développée à l'étape suivante.
    </p>

  </div>
</template>

<style scoped>
.documents-page {
  display: flex;
  flex-direction: column;
  gap: 25px;
  color: #202634;
}

.page-heading,
.section-heading,
.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.eyebrow,
.section-kicker {
  font-size: 10px;
  color: #b51226;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.page-heading h1 {
  font-size: clamp(27px, 3vw, 36px);
  margin: 10px 0;
  font-weight: 800;
}

.page-heading h1 span {
  color: #b51226;
}

.page-heading p,
.section-heading p,
.library-header p {
  color: #9099a7;
  font-size: 12px;
  line-height: 1.8;
  margin: 6px 0 0;
}

.heading-icon {
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  background: #fff0f2;
  color: #b51226;
  border: 1px solid #f8dce0;
  border-radius: 16px;
  font-size: 29px;
}

.intro-banner {
  min-height: 220px;
  padding: 35px 40px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  border-radius: 20px;
  color: white;
  background: linear-gradient(115deg, #9f0c20, #c71933 65%, #e3485e);
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 650px;
}

.banner-label {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
  color: #ffd9df;
}

.banner-content h2 {
  font-size: clamp(24px, 3vw, 36px);
  line-height: 1.3;
  margin: 14px 0;
}

.banner-content p {
  font-size: 12px;
  line-height: 1.9;
  color: #ffe5e9;
  max-width: 470px;
}

.banner-art {
  position: absolute;
  right: 90px;
  top: 15px;
  width: 220px;
  height: 220px;
  display: grid;
  place-items: center;
}

.art-ring {
  position: absolute;
  width: 220px;
  height: 220px;
  border: 1px solid rgba(255,255,255,.22);
  border-radius: 50%;
  box-shadow: 0 0 0 35px rgba(255,255,255,.035);
}

.art-file {
  width: 105px;
  height: 132px;
  padding: 22px 16px;
  background: rgba(255,255,255,.2);
  border: 1px solid rgba(255,255,255,.4);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  transform: rotate(-8deg);
  box-shadow: 0 15px 35px rgba(80,0,15,.2);
}

.art-file span {
  display: block;
  font-size: 22px;
  font-weight: 800;
  margin-bottom: 13px;
}

.art-file div {
  height: 5px;
  background: rgba(255,255,255,.6);
  border-radius: 5px;
  margin-bottom: 8px;
}

.art-file div:last-child {
  width: 55%;
}

.art-sparkle {
  position: absolute;
  top: 25px;
  right: 18px;
  font-size: 33px;
  color: #fff0b5;
}

.upload-section,
.library-panel {
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 19px;
  padding: 26px;
  box-shadow: 0 8px 30px rgba(30,35,50,.025);
}

.section-heading h2,
.library-header h2 {
  font-size: 19px;
  margin: 7px 0 0;
}

.secure-label {
  color: #23855e;
  background: #eaf8f0;
  padding: 9px 12px;
  border-radius: 30px;
  font-size: 10px;
  font-weight: 700;
}

.dropzone {
  margin-top: 23px;
  min-height: 285px;
  border: 2px dashed #efb9c2;
  border-radius: 17px;
  background:
    radial-gradient(circle at 50% 0%, #fff0f2, transparent 70%),
    #fffafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 30px 20px;
  cursor: pointer;
  transition: all .2s ease;
}

.dropzone:hover,
.drag-active {
  border-color: #b51226;
  background: #fff1f3;
}

.is-uploading {
  opacity: .7;
  cursor: wait;
}

.upload-icon {
  width: 69px;
  height: 69px;
  border-radius: 19px;
  display: grid;
  place-items: center;
  background: white;
  color: #b51226;
  border: 1px solid #f6d7dd;
  box-shadow: 0 8px 22px rgba(181,18,38,.09);
}

.upload-icon svg {
  width: 32px;
  height: 32px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dropzone h3 {
  margin: 17px 0 5px;
  font-size: 19px;
}

.dropzone > p {
  font-size: 12px;
  color: #9099a7;
}

.upload-button {
  margin-top: 15px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #d51c35, #a80e23);
  color: white;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(181,18,38,.18);
}

.upload-button:hover {
  transform: translateY(-2px);
}

.upload-button:disabled {
  opacity: .6;
  cursor: not-allowed;
}

.upload-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 11px;
  margin-top: 21px;
  color: #a0a7b2;
  font-size: 10px;
}

.info-dot {
  width: 4px;
  height: 4px;
  background: #d4a2aa;
  border-radius: 50%;
}

.progress-panel {
  margin-top: 20px;
  padding: 17px;
  background: #f8f9fb;
  border-radius: 12px;
}

.progress-heading {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 12px;
}

.progress-track {
  height: 8px;
  background: #f2dce0;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #b51226, #e34960);
  border-radius: 20px;
  transition: width .25s;
}

.progress-panel small {
  display: block;
  margin-top: 10px;
  color: #9199a6;
  font-size: 10px;
}

.feedback {
  margin-top: 15px;
  padding: 13px 15px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
}

.success-feedback {
  background: #eaf8f0;
  color: #168452;
}

.error-feedback {
  background: #fff0f2;
  color: #b51226;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-symbol {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 20px;
  font-weight: 800;
  flex-shrink: 0;
}

.stat-symbol.red { background: #fff0f2; color: #b51226; }
.stat-symbol.blue { background: #eaf2ff; color: #467bc6; font-size: 13px; }
.stat-symbol.amber { background: #fff4e5; color: #bb811e; }

.stat-card > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-card span {
  font-size: 11px;
  color: #8c95a3;
}

.stat-card strong {
  font-size: 26px;
  font-weight: 800;
}

.stat-card small {
  font-size: 10px;
  color: #a0a7b2;
}

.library-header {
  margin-bottom: 22px;
}

.filters {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  padding: 11px 13px;
  border: 1px solid #e6e8ee;
  border-radius: 10px;
  background: #fafbfc;
  outline: none;
  font-size: 12px;
}

.search-input:focus,
.filter-select:focus {
  border-color: #b51226;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 780px;
  text-align: left;
}

th {
  background: #f9fafb;
  padding: 16px 13px;
  font-size: 10px;
  color: #8e97a5;
  font-weight: 800;
  letter-spacing: .6px;
}

td {
  padding: 16px 13px;
  border-bottom: 1px solid #f0f1f4;
  font-size: 12px;
  color: #667080;
}

.file-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pdf-icon {
  width: 42px;
  height: 45px;
  border-radius: 10px;
  background: #fff0f2;
  color: #b51226;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.file-cell strong {
  display: block;
  font-size: 12px;
  color: #293241;
}

.file-cell small {
  display: block;
  margin-top: 5px;
  font-size: 10px;
  color: #a1a8b3;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 30px;
  background: #fff4e5;
  color: #a87920;
  font-size: 10px;
  font-weight: 700;
}

.status-badge span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d49a2e;
}

.row-actions {
  display: flex;
  gap: 7px;
}

.row-actions button {
  padding: 8px 10px;
  border: none;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
}

.view-btn {
  background: #eaf2ff;
  color: #467bc6;
}

.delete-btn {
  background: #fff0f2;
  color: #b51226;
}

.empty-state {
  padding: 43px 15px;
  text-align: center;
}

.empty-icon {
  width: 62px;
  height: 62px;
  border-radius: 17px;
  display: grid;
  place-items: center;
  margin: 0 auto 15px;
  background: #fff0f2;
  color: #b51226;
  font-size: 30px;
}

.empty-state h3 {
  margin: 0;
  font-size: 17px;
}

.empty-state p {
  font-size: 12px;
  color: #9aa3af;
  margin: 10px auto 18px;
  max-width: 360px;
  line-height: 1.7;
}

.empty-button {
  padding: 11px 15px;
  border: none;
  border-radius: 9px;
  background: #b51226;
  color: white;
  font-size: 12px;
  font-weight: 800;
}

.footer-note {
  margin: 0;
  font-size: 11px;
  color: #a0a7b2;
  line-height: 1.7;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 800px) {
  .banner-art {
    display: none;
  }

  .intro-banner {
    padding: 28px 24px;
  }
}

@media (max-width: 600px) {
  .upload-section,
  .library-panel {
    padding: 18px;
  }

  .dropzone {
    min-height: 260px;
  }

  .search-input {
    width: 100%;
  }

  .filters {
    width: 100%;
  }
}
</style>
