
<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const fichier = ref(null)
const analyseEnCours = ref(false)
const resultatVisible = ref(false)
const typeAnalyse = ref('complete')
const glisserActif = ref(false)
const fileInput = ref(null)

const optionsAnalyse = [
  {
    id: 'complete',
    icone: '✦',
    titre: 'Analyse complète',
    description: 'Vue d’ensemble du document'
  },
  {
    id: 'resume',
    icone: '▤',
    titre: 'Résumé intelligent',
    description: 'Synthèse des informations'
  },
  {
    id: 'extraction',
    icone: '◈',
    titre: 'Extraction des données',
    description: 'Identification des éléments clés'
  }
]

const nomFichier = computed(() =>
  fichier.value ? fichier.value.name : 'Aucun document sélectionné'
)

const tailleFichier = computed(() => {
  if (!fichier.value) return ''
  return (fichier.value.size / (1024 * 1024)).toFixed(2) + ' Mo'
})

function ouvrirFichier() {
  fileInput.value?.click()
}

function selectionnerFichier(event) {
  const selection = event.target.files?.[0]
  if (selection) definirFichier(selection)
  event.target.value = ''
}

function deposerFichier(event) {
  glisserActif.value = false
  const selection = event.dataTransfer.files?.[0]
  if (selection) definirFichier(selection)
}

function definirFichier(selection) {
  if (!selection.name.toLowerCase().endsWith('.pdf')) {
    alert('Veuillez sélectionner un fichier PDF.')
    return
  }

  if (selection.size > 10 * 1024 * 1024) {
    alert('Le fichier dépasse la limite de 10 Mo.')
    return
  }

  fichier.value = selection
  resultatVisible.value = false
}

function lancerAnalyse() {
  if (!fichier.value || analyseEnCours.value) return

  // Aucun appel IA n'est encore disponible.
  // On affiche uniquement un aperçu de la future interface.
  resultatVisible.value = true
}

function reinitialiser() {
  fichier.value = null
  resultatVisible.value = false
  typeAnalyse.value = 'complete'
}
</script>

<template>
  <div class="analysis-page cosider-fade-in">

    <!-- EN-TÊTE -->
    <div class="page-heading">
      <div>
        <span class="eyebrow">COSIDER AI · DOCUMENT ANALYTICS</span>
        <h1>Analyse <span>intelligente.</span></h1>
        <p>
          Un espace dédié à l'exploration, à la compréhension
          et à la valorisation de vos documents.
        </p>
      </div>

      <div class="heading-symbol">✦</div>
    </div>

    <!-- BANNIÈRE -->
    <section class="analysis-hero">
      <div class="hero-content">
        <div class="hero-label">✦ DOCUMENT INTELLIGENCE LAB</div>

        <h2>
          Révélez le potentiel<br />
          de vos <span>informations.</span>
        </h2>

        <p>
          Préparez vos documents pour une analyse structurée :
          résumé, extraction d'informations et exploration des contenus.
        </p>

        <div class="hero-features">
          <span>✓ Résumé documentaire</span>
          <span>✓ Extraction des données</span>
          <span>✓ Exploration intelligente</span>
        </div>
      </div>

      <div class="hero-art" aria-hidden="true">
        <div class="hero-orbit"></div>
        <div class="hero-core">✦</div>
        <div class="hero-floating one">▤ PDF</div>
        <div class="hero-floating two">◈ DATA</div>
      </div>
    </section>

    <!-- ÉTAPES -->
    <div class="steps">
      <div class="step">
        <span class="step-number active">01</span>
        <div>
          <strong>Sélectionner</strong>
          <small>Votre document PDF</small>
        </div>
      </div>

      <div class="step-line"></div>

      <div class="step">
        <span class="step-number" :class="{ active: fichier }">02</span>
        <div>
          <strong>Configurer</strong>
          <small>Le type d'analyse</small>
        </div>
      </div>

      <div class="step-line"></div>

      <div class="step">
        <span class="step-number" :class="{ active: resultatVisible }">03</span>
        <div>
          <strong>Explorer</strong>
          <small>L'aperçu des résultats</small>
        </div>
      </div>
    </div>

    <!-- ESPACE DE TRAVAIL -->
    <div class="workspace-grid">

      <!-- DOCUMENT -->
      <section class="panel upload-panel">
        <div class="panel-header">
          <div>
            <span class="section-kicker">ÉTAPE 01</span>
            <h3>Votre document</h3>
            <p>Sélectionnez un PDF à examiner.</p>
          </div>

          <span class="panel-icon">▤</span>
        </div>

        <div
          class="upload-zone"
          :class="{ 'drag-active': glisserActif }"
          role="button"
          tabindex="0"
          @click="ouvrirFichier"
          @keydown.enter.prevent="ouvrirFichier"
          @keydown.space.prevent="ouvrirFichier"
          @dragover.prevent="glisserActif = true"
          @dragleave.prevent="glisserActif = false"
          @drop.prevent="deposerFichier"
        >
          <div class="upload-symbol">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M12 16V4m0 0L7 9m5-5 5 5"/>
              <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>
            </svg>
          </div>

          <h4>Déposez votre document</h4>
          <p>ou cliquez pour parcourir vos fichiers</p>

          <button class="choose-btn" @click.stop="ouvrirFichier">
            + Choisir un PDF
          </button>

          <small>Format PDF · 10 Mo maximum</small>

          <input
            ref="fileInput"
            type="file"
            accept=".pdf,application/pdf"
            hidden
            @change="selectionnerFichier"
          />
        </div>

        <div v-if="fichier" class="selected-file">
          <div class="selected-icon">PDF</div>

          <div class="selected-info">
            <strong>{{ nomFichier }}</strong>
            <span>{{ tailleFichier }} · Prêt pour la démonstration</span>
          </div>

          <button
            class="remove-file"
            aria-label="Retirer le fichier"
            @click="reinitialiser"
          >
            ×
          </button>
        </div>
      </section>

      <!-- OPTIONS -->
      <section class="panel options-panel">
        <div class="panel-header">
          <div>
            <span class="section-kicker">ÉTAPE 02</span>
            <h3>Configuration de l'analyse</h3>
            <p>Choisissez la fonctionnalité à explorer.</p>
          </div>

          <span class="panel-icon">⚙</span>
        </div>

        <div class="analysis-options">
          <label
            v-for="option in optionsAnalyse"
            :key="option.id"
            class="analysis-option"
            :class="{ selected: typeAnalyse === option.id }"
          >
            <input
              v-model="typeAnalyse"
              type="radio"
              :value="option.id"
            />

            <span class="option-symbol">{{ option.icone }}</span>

            <span class="option-text">
              <strong>{{ option.titre }}</strong>
              <small>{{ option.description }}</small>
            </span>

            <span class="radio-circle"></span>
          </label>
        </div>

        <button
          class="analyze-button"
          :disabled="!fichier || analyseEnCours"
          @click="lancerAnalyse"
        >
          <span>✦</span>
          Prévisualiser l'analyse
          <span>↗</span>
        </button>

        <p class="analysis-disclaimer">
          Mode démonstration : aucun contenu PDF n'est encore
          analysé automatiquement.
        </p>
      </section>
    </div>

    <!-- RÉSULTATS -->
    <section v-if="resultatVisible" class="results-section">
      <div class="results-heading">
        <div>
          <span class="section-kicker">ÉTAPE 03 · RESULTS CENTER</span>
          <h2>Aperçu des résultats</h2>
          <p>
            Présentation de la future analyse de
            <strong>{{ nomFichier }}</strong>
          </p>
        </div>

        <span class="demo-badge">Démonstration</span>
      </div>

      <div class="results-grid">
        <div class="result-card">
          <div class="result-icon red">✦</div>
          <h3>Synthèse documentaire</h3>
          <p>
            Le résumé du document apparaîtra ici lorsque
            le moteur d'intelligence artificielle sera connecté.
          </p>
          <div class="result-placeholder">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div class="result-card">
          <div class="result-icon blue">◈</div>
          <h3>Informations clés</h3>
          <p>
            Les dates, entités, concepts et informations importantes
            pourront être présentés dans cet espace.
          </p>
          <div class="result-placeholder">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div class="result-card">
          <div class="result-icon green">✓</div>
          <h3>Exploration intelligente</h3>
          <p>
            L'assistant pourra ensuite répondre à vos questions
            à partir des informations extraites.
          </p>

          <RouterLink to="/chat" class="result-link">
            Ouvrir l'assistant IA →
          </RouterLink>
        </div>
      </div>

      <div class="results-notice">
        <span>ⓘ</span>
        <p>
          Ces blocs illustrent la présentation prévue des résultats.
          Aucun résumé, extraction ou diagnostic réel n'a été généré.
        </p>
      </div>
    </section>

    <!-- FONCTIONNALITÉS -->
    <section class="features-section">
      <div class="features-heading">
        <span class="section-kicker">PLATEFORME DOCUMENTAIRE</span>
        <h2>Une nouvelle manière d'exploiter vos documents</h2>
        <p>Les fonctionnalités que nous allons développer pour COSIDER AI.</p>
      </div>

      <div class="features-grid">
        <div class="feature">
          <div class="feature-icon">▤</div>
          <strong>Centralisation</strong>
          <p>Rassembler les documents dans un espace unique.</p>
        </div>

        <div class="feature">
          <div class="feature-icon">✦</div>
          <strong>Compréhension</strong>
          <p>Produire des synthèses et identifier les idées essentielles.</p>
        </div>

        <div class="feature">
          <div class="feature-icon">◈</div>
          <strong>Recherche intelligente</strong>
          <p>Explorer les contenus à l'aide de questions naturelles.</p>
        </div>

        <div class="feature">
          <div class="feature-icon">✓</div>
          <strong>Productivité</strong>
          <p>Faciliter l'accès aux informations documentaires.</p>
        </div>
      </div>
    </section>

    <footer class="page-footer">
      COSIDER AI · Document Intelligence Platform · Interface de démonstration
    </footer>
  </div>
</template>

<style scoped>
.analysis-page {
  display: flex;
  flex-direction: column;
  gap: 26px;
  color: #202634;
}

.page-heading,
.panel-header,
.results-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.page-heading p,
.panel-header p,
.results-heading p {
  color: #9199a7;
  font-size: 12px;
  line-height: 1.8;
  margin: 6px 0 0;
}

.heading-symbol {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  background: #fff0f2;
  border: 1px solid #f5d6dc;
  border-radius: 17px;
  color: #b51226;
  font-size: 30px;
}

.analysis-hero {
  position: relative;
  overflow: hidden;
  min-height: 265px;
  display: flex;
  align-items: center;
  border-radius: 21px;
  padding: 37px 43px;
  background: linear-gradient(115deg, #990d20, #bd1730 58%, #e64b61);
  color: white;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 630px;
}

.hero-label {
  display: inline-block;
  border: 1px solid rgba(255,255,255,.25);
  background: rgba(255,255,255,.12);
  padding: 8px 12px;
  border-radius: 30px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.analysis-hero h2 {
  font-size: clamp(28px, 3vw, 39px);
  line-height: 1.3;
  margin: 17px 0 12px;
}

.analysis-hero h2 span {
  color: #ffd7de;
}

.analysis-hero p {
  color: #ffe3e8;
  font-size: 12px;
  line-height: 1.9;
  max-width: 460px;
}

.hero-features {
  display: flex;
  gap: 13px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.hero-features span {
  font-size: 10px;
  color: white;
  font-weight: 700;
}

.hero-art {
  position: absolute;
  width: 270px;
  height: 270px;
  right: 65px;
  display: grid;
  place-items: center;
}

.hero-orbit {
  position: absolute;
  width: 235px;
  height: 235px;
  border: 1px solid rgba(255,255,255,.23);
  border-radius: 50%;
  box-shadow: 0 0 0 35px rgba(255,255,255,.035);
}

.hero-core {
  width: 110px;
  height: 110px;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 28px;
  background: rgba(255,255,255,.2);
  backdrop-filter: blur(10px);
  display: grid;
  place-items: center;
  font-size: 58px;
}

.hero-floating {
  position: absolute;
  background: white;
  color: #b51226;
  padding: 12px 15px;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 12px 30px rgba(70,0,15,.15);
}

.hero-floating.one {
  top: 30px;
  right: -10px;
}

.hero-floating.two {
  bottom: 35px;
  left: -15px;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 21px;
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 15px;
}

.step {
  display: flex;
  align-items: center;
  gap: 11px;
}

.step-number {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  background: #f3f4f7;
  color: #9aa2ae;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 800;
}

.step-number.active {
  background: #b51226;
  color: white;
}

.step div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step strong {
  font-size: 12px;
}

.step small {
  font-size: 10px;
  color: #a1a8b3;
}

.step-line {
  width: 60px;
  height: 1px;
  background: #e6e8ed;
}

.workspace-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.panel {
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 19px;
  padding: 25px;
  box-shadow: 0 8px 30px rgba(30,35,50,.025);
}

.panel-header h3 {
  margin: 7px 0 0;
  font-size: 18px;
}

.panel-icon {
  width: 43px;
  height: 43px;
  border-radius: 12px;
  background: #fff0f2;
  color: #b51226;
  display: grid;
  place-items: center;
  font-size: 23px;
}

.upload-zone {
  margin-top: 23px;
  border: 2px dashed #efbdc5;
  background: #fffafb;
  border-radius: 15px;
  min-height: 260px;
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all .2s;
}

.upload-zone:hover,
.drag-active {
  border-color: #b51226;
  background: #fff1f3;
}

.upload-symbol {
  width: 63px;
  height: 63px;
  border-radius: 17px;
  background: white;
  border: 1px solid #f5d7dd;
  display: grid;
  place-items: center;
  color: #b51226;
}

.upload-symbol svg {
  width: 29px;
  height: 29px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.upload-zone h4 {
  margin: 15px 0 5px;
  font-size: 16px;
}

.upload-zone p {
  margin: 0;
  font-size: 11px;
  color: #9ba3af;
}

.choose-btn {
  margin-top: 16px;
  padding: 11px 16px;
  border: none;
  border-radius: 9px;
  background: #b51226;
  color: white;
  font-size: 11px;
  font-weight: 800;
}

.choose-btn:hover {
  background: #991023;
}

.upload-zone > small {
  margin-top: 14px;
  color: #a3aab5;
  font-size: 10px;
}

.selected-file {
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #e9ecf1;
  border-radius: 11px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-icon {
  width: 42px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: #fff0f2;
  color: #b51226;
  font-size: 11px;
  font-weight: 800;
}

.selected-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  flex: 1;
}

.selected-info strong {
  font-size: 12px;
  overflow-wrap: anywhere;
}

.selected-info span {
  font-size: 10px;
  color: #9aa3af;
}

.remove-file {
  border: none;
  background: #fff0f2;
  color: #b51226;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  font-size: 20px;
}

.analysis-options {
  margin-top: 23px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.analysis-option {
  display: flex;
  align-items: center;
  gap: 13px;
  border: 1px solid #e9ebf0;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all .2s;
}

.analysis-option:hover {
  border-color: #edb6bf;
}

.analysis-option.selected {
  border-color: #d84c60;
  background: #fff7f8;
}

.analysis-option input {
  position: absolute;
  opacity: 0;
}

.option-symbol {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: #fff0f2;
  color: #b51226;
  font-size: 22px;
  flex-shrink: 0;
}

.option-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.option-text strong {
  font-size: 12px;
}

.option-text small {
  font-size: 10px;
  color: #98a1ae;
}

.radio-circle {
  width: 18px;
  height: 18px;
  border: 2px solid #d4d8e0;
  border-radius: 50%;
  flex-shrink: 0;
}

.selected .radio-circle {
  border: 5px solid #b51226;
}

.analyze-button {
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  padding: 14px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(135deg, #d51b35, #a50d22);
  color: white;
  font-size: 12px;
  font-weight: 800;
}

.analyze-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.analyze-button:disabled {
  background: #e5c6cc;
  cursor: not-allowed;
}

.analysis-disclaimer {
  text-align: center;
  color: #a2a9b4;
  font-size: 10px;
  line-height: 1.7;
  margin: 12px 0 0;
}

.results-section {
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 19px;
  padding: 27px;
}

.results-heading h2 {
  font-size: 21px;
  margin: 8px 0 0;
}

.demo-badge {
  color: #ad741d;
  background: #fff4e5;
  padding: 9px 12px;
  border-radius: 30px;
  font-size: 10px;
  font-weight: 800;
}

.results-grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.result-card {
  border: 1px solid #eaecf1;
  border-radius: 14px;
  padding: 21px;
}

.result-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-size: 23px;
}

.result-icon.red { background: #fff0f2; color: #b51226; }
.result-icon.blue { background: #eaf2ff; color: #477ed0; }
.result-icon.green { background: #eaf8f0; color: #219668; }

.result-card h3 {
  margin: 17px 0 9px;
  font-size: 14px;
}

.result-card p {
  color: #919aa8;
  font-size: 11px;
  line-height: 1.8;
}

.result-placeholder {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 18px;
}

.result-placeholder span {
  height: 8px;
  border-radius: 10px;
  background: #f0f1f4;
}

.result-placeholder span:nth-child(2) { width: 85%; }
.result-placeholder span:nth-child(3) { width: 60%; }

.result-link {
  display: inline-block;
  color: #b51226;
  font-size: 11px;
  font-weight: 800;
  margin-top: 12px;
}

.results-notice {
  margin-top: 18px;
  padding: 15px;
  background: #fff9ef;
  border: 1px solid #f7e7c9;
  border-radius: 11px;
  display: flex;
  gap: 11px;
  align-items: flex-start;
  color: #a87727;
}

.results-notice > span {
  font-size: 18px;
}

.results-notice p {
  margin: 0;
  font-size: 11px;
  line-height: 1.8;
}

.features-section {
  padding: 8px 0;
}

.features-heading {
  text-align: center;
  margin-bottom: 25px;
}

.features-heading h2 {
  font-size: 23px;
  margin: 10px 0;
}

.features-heading p {
  font-size: 12px;
  color: #939baa;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.feature {
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 15px;
  padding: 21px;
}

.feature-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #fff0f2;
  color: #b51226;
  display: grid;
  place-items: center;
  font-size: 22px;
  margin-bottom: 17px;
}

.feature strong {
  font-size: 12px;
}

.feature p {
  color: #929baa;
  font-size: 11px;
  line-height: 1.8;
}

.page-footer {
  color: #a1a8b3;
  font-size: 10px;
  text-align: center;
}

@media (max-width: 1100px) {
  .hero-art {
    opacity: .4;
    right: -25px;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 850px) {
  .workspace-grid,
  .results-grid {
    grid-template-columns: 1fr;
  }

  .hero-art {
    display: none;
  }

  .step-line {
    width: 20px;
  }
}

@media (max-width: 600px) {
  .analysis-hero {
    padding: 28px 23px;
  }

  .steps {
    justify-content: space-between;
    gap: 7px;
    padding: 14px;
  }

  .step {
    flex-direction: column;
    text-align: center;
  }

  .step-line {
    display: none;
  }

  .step small {
    display: none;
  }

  .panel,
  .results-section {
    padding: 19px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
