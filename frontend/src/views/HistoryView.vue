
<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

const STORAGE_KEY = 'cosider-ai-history'

function chargerHistorique() {
  try {
    const sauvegarde = localStorage.getItem(STORAGE_KEY)
    const donnees = sauvegarde ? JSON.parse(sauvegarde) : []
    return Array.isArray(donnees) ? donnees : []
  } catch {
    return []
  }
}

const historique = ref(chargerHistorique())
const recherche = ref('')
const filtre = ref('Tous')
const afficherFormulaire = ref(false)
const nouveauTitre = ref('')
const nouvelleDescription = ref('')

watch(
  historique,
  valeur => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(valeur))
    } catch {
      // Le navigateur peut refuser le stockage local.
    }
  },
  { deep: true }
)

const historiqueFiltre = computed(() => {
  return historique.value.filter(item => {
    const texte = recherche.value.toLowerCase()

    const correspondRecherche =
      item.titre.toLowerCase().includes(texte) ||
      item.description.toLowerCase().includes(texte)

    const correspondType =
      filtre.value === 'Tous' || item.type === filtre.value

    return correspondRecherche && correspondType
  })
})

const totalConversations = computed(() =>
  historique.value.filter(item => item.type === 'Conversation').length
)

const totalNotes = computed(() =>
  historique.value.filter(item => item.type === 'Note').length
)

function ajouterNote() {
  const titre = nouveauTitre.value.trim()
  const description = nouvelleDescription.value.trim()

  if (!titre) return

  historique.value.unshift({
    id: Date.now().toString(),
    titre,
    description,
    type: 'Note',
    date: new Date().toLocaleDateString('fr-FR'),
    heure: new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  nouveauTitre.value = ''
  nouvelleDescription.value = ''
  afficherFormulaire.value = false
}

function supprimerElement(id) {
  if (confirm('Supprimer cet élément de votre historique ?')) {
    historique.value = historique.value.filter(item => item.id !== id)
  }
}

function effacerHistorique() {
  if (
    historique.value.length > 0 &&
    confirm('Voulez-vous vraiment effacer tout votre historique local ?')
  ) {
    historique.value = []
  }
}
</script>

<template>
  <div class="history-page cosider-fade-in">

    <!-- EN-TÊTE -->
    <div class="page-heading">
      <div>
        <span class="eyebrow">COSIDER AI · ACTIVITY CENTER</span>
        <h1>Votre <span>historique.</span></h1>
        <p>
          Retrouvez vos notes et, prochainement,
          vos conversations et analyses documentaires.
        </p>
      </div>

      <RouterLink to="/chat" class="primary-button">
        <span>＋</span>
        Nouvelle conversation
      </RouterLink>
    </div>

    <!-- BANNIÈRE -->
    <section class="history-banner">
      <div class="banner-content">
        <span class="banner-label">VOTRE ESPACE DE SUIVI</span>

        <h2>
          Chaque information<br />
          mérite d'être <span>retrouvée.</span>
        </h2>

        <p>
          Conservez vos notes dans un espace organisé.
          L'historique automatique de l'assistant IA sera
          intégré lors de la connexion au backend.
        </p>
      </div>

      <div class="banner-visual" aria-hidden="true">
        <div class="visual-ring"></div>
        <div class="visual-card">
          <div class="visual-clock">◷</div>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>

    <!-- STATISTIQUES -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon red">◷</div>
        <div>
          <span>Éléments enregistrés</span>
          <strong>{{ historique.length }}</strong>
          <small>Stockage dans ce navigateur</small>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon blue">◈</div>
        <div>
          <span>Conversations</span>
          <strong>{{ totalConversations }}</strong>
          <small>Synchronisation IA à venir</small>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon green">▤</div>
        <div>
          <span>Notes personnelles</span>
          <strong>{{ totalNotes }}</strong>
          <small>Notes enregistrées localement</small>
        </div>
      </div>
    </div>

    <!-- HISTORIQUE -->
    <section class="history-panel">
      <div class="panel-header">
        <div>
          <span class="section-kicker">HISTORY EXPLORER</span>
          <h2>Activités enregistrées</h2>
          <p>
            {{ historiqueFiltre.length }} élément(s) affiché(s)
          </p>
        </div>

        <div class="header-actions">
          <button
            class="secondary-button"
            @click="afficherFormulaire = !afficherFormulaire"
          >
            + Ajouter une note
          </button>

          <button
            class="clear-button"
            :disabled="historique.length === 0"
            @click="effacerHistorique"
          >
            Effacer
          </button>
        </div>
      </div>

      <!-- FORMULAIRE DE NOTE -->
      <form
        v-if="afficherFormulaire"
        class="note-form"
        @submit.prevent="ajouterNote"
      >
        <div class="form-heading">
          <strong>Nouvelle note</strong>

          <button
            type="button"
            class="close-button"
            @click="afficherFormulaire = false"
          >
            ×
          </button>
        </div>

        <input
          v-model="nouveauTitre"
          type="text"
          maxlength="120"
          placeholder="Titre de la note"
          required
        />

        <textarea
          v-model="nouvelleDescription"
          rows="3"
          maxlength="1000"
          placeholder="Description ou informations à conserver..."
        ></textarea>

        <button type="submit" class="save-button">
          Enregistrer la note
        </button>
      </form>

      <!-- FILTRES -->
      <div class="filters">
        <div class="search-box">
          <span>⌕</span>
          <input
            v-model="recherche"
            type="search"
            placeholder="Rechercher dans l'historique..."
          />
        </div>

        <div class="filter-buttons">
          <button
            v-for="option in ['Tous', 'Conversation', 'Note']"
            :key="option"
            :class="{ active: filtre === option }"
            @click="filtre = option"
          >
            {{ option === 'Conversation' ? 'Conversations' :
               option === 'Note' ? 'Notes' : 'Tous' }}
          </button>
        </div>
      </div>

      <!-- LISTE -->
      <div v-if="historiqueFiltre.length > 0" class="history-list">
        <div
          v-for="item in historiqueFiltre"
          :key="item.id"
          class="history-item"
        >
          <div class="item-icon">
            {{ item.type === 'Note' ? '▤' : '◈' }}
          </div>

          <div class="item-content">
            <div class="item-top">
              <strong>{{ item.titre }}</strong>
              <span class="type-badge">{{ item.type }}</span>
            </div>

            <p>{{ item.description || 'Aucune description' }}</p>

            <div class="item-date">
              <span>◷</span>
              {{ item.date }} · {{ item.heure }}
            </div>
          </div>

          <button
            class="delete-button"
            aria-label="Supprimer cet élément"
            title="Supprimer"
            @click="supprimerElement(item.id)"
          >
            ×
          </button>
        </div>
      </div>

      <!-- ÉTAT VIDE -->
      <div v-else class="empty-state">
        <div class="empty-symbol">
          <span>◷</span>
        </div>

        <h3>
          {{ recherche || filtre !== 'Tous'
            ? 'Aucun résultat trouvé'
            : 'Votre historique commence ici' }}
        </h3>

        <p>
          {{
            recherche || filtre !== 'Tous'
              ? 'Essayez une autre recherche ou modifiez vos filtres.'
              : 'Ajoutez votre première note. Vos futures conversations IA pourront également apparaître ici.'
          }}
        </p>

        <button
          v-if="!recherche && filtre === 'Tous'"
          class="empty-action"
          @click="afficherFormulaire = true"
        >
          + Créer une première note
        </button>
      </div>
    </section>

    <!-- INFORMATION -->
    <div class="info-panel">
      <div class="info-icon">✦</div>

      <div>
        <strong>Un historique intelligent en préparation</strong>
        <p>
          Cette version conserve uniquement les notes créées sur
          cet appareil. La sauvegarde automatique des conversations,
          la recherche dans les échanges et la synchronisation
          avec FastAPI seront ajoutées progressivement.
        </p>
      </div>

      <RouterLink to="/chat" class="info-link">
        Assistant IA ↗
      </RouterLink>
    </div>

    <footer class="page-footer">
      COSIDER AI · Historique documentaire · Version de développement
    </footer>

  </div>
</template>

<style scoped>
.history-page {
  display: flex;
  flex-direction: column;
  gap: 25px;
  color: #202634;
}

.page-heading,
.panel-header {
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
.panel-header p {
  color: #9199a7;
  font-size: 12px;
  line-height: 1.8;
  margin: 6px 0 0;
}

.primary-button,
.secondary-button,
.save-button,
.empty-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 12px 17px;
  border: none;
  border-radius: 11px;
  background: #b51226;
  color: white;
  font-size: 12px;
  font-weight: 800;
  transition: all .2s;
}

.primary-button:hover,
.save-button:hover,
.empty-action:hover {
  background: #961023;
  transform: translateY(-2px);
}

.primary-button span {
  font-size: 19px;
}

.history-banner {
  position: relative;
  min-height: 240px;
  padding: 35px 42px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 21px;
  background: linear-gradient(115deg, #980c20, #c31a33 62%, #e64b60);
  color: white;
}

.banner-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
}

.banner-label {
  color: #ffd8df;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.banner-content h2 {
  font-size: clamp(27px, 3vw, 38px);
  line-height: 1.3;
  margin: 16px 0 12px;
}

.banner-content h2 span {
  color: #ffd5dd;
}

.banner-content p {
  max-width: 470px;
  color: #ffe4e8;
  font-size: 12px;
  line-height: 1.9;
}

.banner-visual {
  position: absolute;
  width: 260px;
  height: 260px;
  right: 75px;
  display: grid;
  place-items: center;
}

.visual-ring {
  position: absolute;
  width: 240px;
  height: 240px;
  border: 1px solid rgba(255,255,255,.25);
  border-radius: 50%;
  box-shadow: 0 0 0 35px rgba(255,255,255,.04);
}

.visual-card {
  width: 125px;
  height: 155px;
  padding: 19px;
  border: 1px solid rgba(255,255,255,.4);
  border-radius: 19px;
  background: rgba(255,255,255,.2);
  backdrop-filter: blur(10px);
  transform: rotate(-9deg);
  box-shadow: 0 15px 35px rgba(70,0,15,.2);
}

.visual-clock {
  font-size: 38px;
  margin-bottom: 13px;
}

.visual-card > span {
  display: block;
  height: 6px;
  background: rgba(255,255,255,.65);
  border-radius: 10px;
  margin-bottom: 9px;
}

.visual-card > span:last-child {
  width: 60%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px;
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 17px;
}

.stat-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 25px;
  flex-shrink: 0;
}

.stat-icon.red {
  background: #fff0f2;
  color: #b51226;
}

.stat-icon.blue {
  background: #eaf2ff;
  color: #477dcf;
}

.stat-icon.green {
  background: #eaf8f0;
  color: #219668;
}

.stat-card > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-card span {
  font-size: 11px;
  color: #8f98a6;
}

.stat-card strong {
  font-size: 27px;
  font-weight: 800;
}

.stat-card small {
  font-size: 10px;
  color: #a0a7b2;
}

.history-panel {
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 19px;
  padding: 26px;
  box-shadow: 0 8px 30px rgba(30,35,50,.025);
}

.panel-header h2 {
  font-size: 19px;
  margin: 7px 0 0;
}

.header-actions {
  display: flex;
  gap: 9px;
}

.secondary-button {
  background: #fff0f2;
  color: #b51226;
}

.secondary-button:hover {
  background: #fce0e5;
}

.clear-button {
  padding: 11px 15px;
  border: 1px solid #e8eaf0;
  border-radius: 10px;
  background: white;
  color: #7e8795;
  font-size: 11px;
  font-weight: 700;
}

.clear-button:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 23px;
  padding: 20px;
  background: #fff9fa;
  border: 1px solid #f4dce1;
  border-radius: 14px;
}

.form-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-heading strong {
  font-size: 13px;
}

.close-button {
  background: transparent;
  border: none;
  color: #b51226;
  font-size: 24px;
}

.note-form input,
.note-form textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e7e9ef;
  border-radius: 10px;
  background: white;
  outline: none;
  font-size: 12px;
  color: #293241;
  resize: vertical;
}

.note-form input:focus,
.note-form textarea:focus {
  border-color: #b51226;
}

.save-button {
  align-self: flex-start;
}

.filters {
  margin-top: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf0f3;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #e6e8ee;
  border-radius: 10px;
  padding: 0 13px;
  min-width: 280px;
  background: #fafbfc;
}

.search-box span {
  color: #9aa2ae;
  font-size: 22px;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  padding: 12px 0;
  font-size: 12px;
  width: 100%;
}

.filter-buttons {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.filter-buttons button {
  padding: 10px 14px;
  border: 1px solid #e9ebf0;
  border-radius: 9px;
  background: white;
  color: #8992a0;
  font-size: 11px;
  font-weight: 700;
}

.filter-buttons button.active {
  background: #b51226;
  color: white;
  border-color: #b51226;
}

.history-list {
  display: flex;
  flex-direction: column;
}

.history-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 21px 0;
  border-bottom: 1px solid #f0f1f4;
}

.history-item:last-child {
  border-bottom: none;
}

.item-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #fff0f2;
  color: #b51226;
  font-size: 23px;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-top {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.item-top strong {
  font-size: 13px;
}

.type-badge {
  background: #fff0f2;
  color: #b51226;
  padding: 5px 9px;
  border-radius: 30px;
  font-size: 10px;
  font-weight: 700;
}

.item-content p {
  color: #8f98a6;
  font-size: 11px;
  line-height: 1.8;
  margin: 9px 0;
  overflow-wrap: anywhere;
}

.item-date {
  color: #a0a7b2;
  font-size: 10px;
}

.item-date span {
  color: #b51226;
  margin-right: 5px;
}

.delete-button {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 9px;
  background: #fff0f2;
  color: #b51226;
  font-size: 21px;
  flex-shrink: 0;
}

.delete-button:hover {
  background: #fbdce2;
}

.empty-state {
  padding: 65px 20px;
  text-align: center;
}

.empty-symbol {
  width: 85px;
  height: 85px;
  margin: 0 auto 22px;
  border-radius: 25px;
  background: #fff0f2;
  display: grid;
  place-items: center;
  box-shadow: 0 0 0 12px rgba(255,240,242,.5);
}

.empty-symbol span {
  color: #b51226;
  font-size: 45px;
}

.empty-state h3 {
  font-size: 19px;
  margin: 0;
}

.empty-state p {
  max-width: 420px;
  margin: 12px auto 20px;
  color: #939baa;
  font-size: 12px;
  line-height: 1.9;
}

.info-panel {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 22px;
  border: 1px solid #f1dfe3;
  border-radius: 15px;
  background: #fff9fa;
}

.info-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 13px;
  background: #fff0f2;
  color: #b51226;
  display: grid;
  place-items: center;
  font-size: 25px;
}

.info-panel > div:nth-child(2) {
  flex: 1;
}

.info-panel strong {
  font-size: 12px;
}

.info-panel p {
  color: #9199a7;
  font-size: 11px;
  line-height: 1.8;
  margin: 7px 0 0;
}

.info-link {
  color: #b51226;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.page-footer {
  text-align: center;
  color: #a0a7b2;
  font-size: 10px;
}

@media (max-width: 1100px) {
  .banner-visual {
    opacity: .4;
    right: -25px;
  }
}

@media (max-width: 800px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .banner-visual {
    display: none;
  }

  .info-panel {
    align-items: flex-start;
    flex-wrap: wrap;
  }
}

@media (max-width: 600px) {
  .history-banner {
    padding: 29px 23px;
  }

  .history-panel {
    padding: 18px;
  }

  .search-box {
    min-width: 100%;
  }

  .filter-buttons {
    width: 100%;
  }

  .header-actions {
    width: 100%;
  }
}
</style>
