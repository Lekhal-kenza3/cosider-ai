
<script setup>
import { ref, computed } from 'vue'

// Documents fictifs disponibles
const documents = [
  {
    id: 1,
    nom: 'Rapport annuel COSIDER 2025.pdf',
    type: 'PDF',
    categorie: 'Rapports',
    resume: 'Ce rapport présente un aperçu des activités annuelles, des réalisations, des objectifs et des perspectives de développement de l’entreprise.',
    motsCles: ['COSIDER', 'Rapport annuel', 'Activités', 'Objectifs'],
    entites: ['COSIDER', '2025', 'Rapport annuel'],
    confiance: 96
  },
  {
    id: 2,
    nom: 'Procédures de sécurité chantier.pdf',
    type: 'PDF',
    categorie: 'Sécurité',
    resume: 'Ce document présente les principales procédures de sécurité sur les chantiers, les mesures de prévention des risques professionnels et les équipements de protection individuelle.',
    motsCles: ['Sécurité', 'Chantier', 'Prévention', 'EPI'],
    entites: ['Chantier', 'Équipements de protection', 'Personnel'],
    confiance: 94
  },
  {
    id: 3,
    nom: 'Planning des travaux.xlsx',
    type: 'Excel',
    categorie: 'Planification',
    resume: 'Ce fichier présente un planning prévisionnel des travaux, les différentes phases du projet, les échéances et les tâches à réaliser.',
    motsCles: ['Planning', 'Travaux', 'Délais', 'Projet'],
    entites: ['Projet', 'Calendrier', 'Équipes'],
    confiance: 91
  },
  {
    id: 4,
    nom: 'Cahier des charges.docx',
    type: 'Word',
    categorie: 'Technique',
    resume: 'Ce document décrit les exigences techniques et fonctionnelles, les contraintes du projet et les résultats attendus.',
    motsCles: ['Exigences', 'Technique', 'Projet', 'Spécifications'],
    entites: ['Projet', 'Cahier des charges', 'Livrables'],
    confiance: 93
  },
  {
    id: 5,
    nom: 'Budget prévisionnel 2026.xlsx',
    type: 'Excel',
    categorie: 'Finance',
    resume: 'Ce document présente une estimation des dépenses, les ressources financières prévues et la répartition budgétaire du projet.',
    motsCles: ['Budget', 'Finance', 'Dépenses', 'Prévisions'],
    entites: ['Budget 2026', 'Projet', 'Ressources'],
    confiance: 95
  }
]

// Variables réactives
const documentSelectionne = ref('')
const analyseEnCours = ref(false)
const resultat = ref(null)
const progression = ref(0)

// Document choisi
const documentActuel = computed(() =>
  documents.find(doc => doc.id === Number(documentSelectionne.value))
)

// Lancer une analyse simulée
function lancerAnalyse() {
  if (!documentActuel.value || analyseEnCours.value) return

  const document = documentActuel.value

  analyseEnCours.value = true
  resultat.value = null
  progression.value = 0

  const intervalle = setInterval(() => {
    progression.value = Math.min(progression.value + 10, 100)

    if (progression.value >= 100) {
      clearInterval(intervalle)

      resultat.value = { ...document }
      analyseEnCours.value = false
    }
  }, 180)
}

// Réinitialiser
function reinitialiser() {
  if (analyseEnCours.value) return

  documentSelectionne.value = ''
  resultat.value = null
  progression.value = 0
}

// Exporter le résultat en texte
function exporterResultat() {
  if (!resultat.value) return

  const r = resultat.value

  const contenu = [
    'COSIDER AI - RAPPORT D ANALYSE (DEMONSTRATION)',
    '',
    `Document : ${r.nom}`,
    `Categorie : ${r.categorie}`,
    `Score fictif : ${r.confiance}%`,
    '',
    'RESUME',
    r.resume,
    '',
    'MOTS-CLES',
    r.motsCles.join(', '),
    '',
    'ENTITES',
    r.entites.join(', ')
  ].join('\n')

  const fichier = new Blob([contenu], {
    type: 'text/plain;charset=utf-8'
  })

  const url = URL.createObjectURL(fichier)
  const lien = document.createElement('a')

  lien.href = url
  lien.download = 'analyse-cosider-demo.txt'
  lien.click()

  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="analysis-page">

    <!-- EN-TÊTE -->
    <div class="page-header">
      <div>
        <h2>Analyse documentaire</h2>
        <p>
          Explorez les informations essentielles de vos documents.
        </p>
      </div>

      <span class="demo-badge">✦ Mode démonstration</span>
    </div>

    <!-- STATISTIQUES -->
    <div class="stats-grid">
      <div class="stat-card">
        <span>Documents disponibles</span>
        <strong>{{ documents.length }}</strong>
        <small>Documents de démonstration</small>
      </div>

      <div class="stat-card">
        <span>Types d'analyse</span>
        <strong>3</strong>
        <small>Résumé, mots-clés, entités</small>
      </div>

      <div class="stat-card">
        <span>Analyse actuelle</span>
        <strong>{{ resultat ? '1' : '0' }}</strong>
        <small>Résultat affiché</small>
      </div>
    </div>

    <!-- SÉLECTION DU DOCUMENT -->
    <section class="analysis-card">
      <div class="section-title">
        <div class="section-icon">▤</div>
        <div>
          <h3>Sélectionner un document</h3>
          <p>Choisissez le document que vous souhaitez analyser.</p>
        </div>
      </div>

      <div class="selection-area">
        <select
          v-model="documentSelectionne"
          :disabled="analyseEnCours"
          class="document-select"
        >
          <option value="">-- Choisir un document --</option>

          <option
            v-for="doc in documents"
            :key="doc.id"
            :value="doc.id"
          >
            {{ doc.nom }}
          </option>
        </select>

        <button
          class="primary-btn"
          :disabled="!documentSelectionne || analyseEnCours"
          @click="lancerAnalyse"
        >
          {{ analyseEnCours ? 'Analyse en cours...' : '✦ Lancer l’analyse' }}
        </button>
      </div>

      <!-- DOCUMENT SÉLECTIONNÉ -->
      <div v-if="documentActuel" class="selected-document">
        <div class="file-icon">
          {{ documentActuel.type }}
        </div>

        <div>
          <strong>{{ documentActuel.nom }}</strong>
          <p>{{ documentActuel.categorie }} · {{ documentActuel.type }}</p>
        </div>
      </div>

      <!-- BARRE DE PROGRESSION -->
      <div v-if="analyseEnCours" class="progress-section">
        <div class="progress-label">
          <span>Simulation de l'analyse...</span>
          <strong>{{ progression }}%</strong>
        </div>

        <div
          class="progress-track"
          role="progressbar"
          :aria-valuenow="progression"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            class="progress-fill"
            :style="{ width: progression + '%' }"
          ></div>
        </div>
      </div>
    </section>

    <!-- RÉSULTATS -->
    <template v-if="resultat">

      <div class="results-header">
        <div>
          <h3>Résultats de l'analyse</h3>
          <p>Résultats prédéfinis à titre de démonstration.</p>
        </div>

        <div class="header-actions">
          <button class="secondary-btn" @click="reinitialiser">
            Réinitialiser
          </button>
          <button class="primary-btn" @click="exporterResultat">
            ↓ Exporter TXT
          </button>
        </div>
      </div>

      <!-- RÉSUMÉ -->
      <section class="analysis-card">
        <div class="section-title">
          <div class="section-icon">✦</div>
          <div>
            <h3>Résumé du document</h3>
            <p>Synthèse prédéfinie du document sélectionné</p>
          </div>
        </div>

        <p class="summary-text">{{ resultat.resume }}</p>
      </section>

      <div class="results-grid">

        <!-- MOTS-CLÉS -->
        <section class="analysis-card">
          <div class="section-title">
            <div class="section-icon">#</div>
            <div>
              <h3>Mots-clés</h3>
              <p>Principaux thèmes identifiés</p>
            </div>
          </div>

          <div class="keywords">
            <span
              v-for="mot in resultat.motsCles"
              :key="mot"
              class="keyword"
            >
              {{ mot }}
            </span>
          </div>
        </section>

        <!-- ENTITÉS -->
        <section class="analysis-card">
          <div class="section-title">
            <div class="section-icon">◎</div>
            <div>
              <h3>Entités identifiées</h3>
              <p>Informations associées au document</p>
            </div>
          </div>

          <div class="entities">
            <div
              v-for="entite in resultat.entites"
              :key="entite"
              class="entity-row"
            >
              <span class="entity-dot"></span>
              {{ entite }}
            </div>
          </div>
        </section>
      </div>

      <!-- CLASSIFICATION -->
      <section class="analysis-card">
        <div class="section-title">
          <div class="section-icon">◈</div>
          <div>
            <h3>Classification du document</h3>
            <p>Catégorie et score fictif</p>
          </div>
        </div>

        <div class="classification">
          <div>
            <span class="field-label">Catégorie</span>
            <strong class="category-badge">
              {{ resultat.categorie }}
            </strong>
          </div>

          <div class="confidence">
            <div class="confidence-label">
              <span>Score de confiance simulé</span>
              <strong>{{ resultat.confiance }}%</strong>
            </div>

            <div class="progress-track">
              <div
                class="progress-fill"
                :style="{ width: resultat.confiance + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ÉTAT INITIAL -->
    <div v-else-if="!analyseEnCours" class="empty-state">
      <div class="empty-icon">✦</div>
      <h3>Aucune analyse affichée</h3>
      <p>
        Sélectionnez un document puis cliquez sur
        « Lancer l’analyse » pour afficher les résultats.
      </p>
    </div>

    <p class="demo-note">
      Cette page ne lit pas encore le contenu réel des fichiers.
      Les analyses sont entièrement simulées côté frontend.
    </p>
  </div>
</template>

<style scoped>
.analysis-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: #273441;
}

.page-header,
.results-header,
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 700;
}

.page-header p,
.results-header p,
.section-title p {
  font-size: 13px;
  color: #87939e;
  margin-top: 5px;
}

.demo-badge {
  background: #f8eadf;
  color: #a65e32;
  border-radius: 30px;
  padding: 9px 14px;
  font-size: 12px;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stat-card,
.analysis-card {
  background: white;
  border: 1px solid #e6e9ed;
  border-radius: 15px;
  padding: 23px;
  box-shadow: 0 4px 15px rgba(20, 30, 40, .025);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.stat-card span,
.stat-card small {
  color: #84909a;
  font-size: 13px;
}

.stat-card strong {
  font-size: 30px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-bottom: 22px;
}

.section-title h3,
.results-header h3 {
  font-size: 17px;
  font-weight: 700;
}

.section-icon {
  width: 43px;
  height: 43px;
  background: #f7e9df;
  color: #b76b43;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 21px;
  flex-shrink: 0;
}

.selection-area {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.document-select {
  flex: 1;
  min-width: 220px;
  border: 1px solid #dce2e7;
  border-radius: 9px;
  padding: 12px;
  background: white;
  outline: none;
}

.document-select:focus {
  border-color: #b76b43;
}

.primary-btn,
.secondary-btn {
  padding: 12px 18px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.primary-btn {
  background: #b76b43;
  color: white;
}

.primary-btn:hover {
  background: #975331;
}

.primary-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.secondary-btn {
  background: white;
  color: #53616c;
  border: 1px solid #dce2e7;
}

.selected-document {
  display: flex;
  align-items: center;
  gap: 13px;
  background: #f9fafb;
  border-radius: 10px;
  padding: 15px;
  margin-top: 18px;
}

.selected-document strong {
  font-size: 13px;
  overflow-wrap: anywhere;
}

.selected-document p {
  font-size: 12px;
  color: #87939e;
  margin-top: 5px;
}

.file-icon {
  background: #fbe8df;
  color: #b76b43;
  padding: 12px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
}

.progress-section {
  margin-top: 22px;
}

.progress-label,
.confidence-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 10px;
}

.progress-track {
  height: 9px;
  border-radius: 20px;
  background: #edf0f2;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(90deg, #b76b43, #e1a57e);
  transition: width .18s ease;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.summary-text {
  font-size: 14px;
  line-height: 1.9;
  color: #56636d;
  background: #faf8f6;
  border-left: 3px solid #b76b43;
  padding: 18px;
  border-radius: 0 9px 9px 0;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword {
  background: #f8eadf;
  color: #a65e32;
  padding: 9px 13px;
  border-radius: 25px;
  font-size: 12px;
  font-weight: 600;
}

.entities {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.entity-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  border-radius: 9px;
  padding: 11px;
  font-size: 13px;
}

.entity-dot {
  width: 8px;
  height: 8px;
  background: #b76b43;
  border-radius: 50%;
  flex-shrink: 0;
}

.classification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  flex-wrap: wrap;
}

.field-label {
  display: block;
  color: #84909a;
  font-size: 12px;
  margin-bottom: 10px;
}

.category-badge {
  display: inline-block;
  background: #e9f3ee;
  color: #34815a;
  padding: 9px 15px;
  border-radius: 9px;
  font-size: 13px;
}

.confidence {
  flex: 1;
  max-width: 400px;
  min-width: 180px;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  background: white;
  border: 1px dashed #dce2e7;
  border-radius: 15px;
}

.empty-icon {
  width: 65px;
  height: 65px;
  background: #f8eadf;
  color: #b76b43;
  border-radius: 17px;
  display: grid;
  place-items: center;
  font-size: 32px;
  margin: 0 auto 18px;
}

.empty-state h3 {
  font-size: 17px;
  font-weight: 700;
}

.empty-state p {
  color: #87939e;
  font-size: 13px;
  margin: 10px auto 0;
  max-width: 400px;
  line-height: 1.7;
}

.demo-note {
  color: #9aa4ad;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 700px) {
  .stats-grid,
  .results-grid {
    grid-template-columns: 1fr;
  }

  .selection-area {
    flex-direction: column;
  }

  .document-select {
    min-width: 0;
    width: 100%;
  }
}
</style>
