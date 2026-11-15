
<script setup>
import {
  ref,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  watch
} from 'vue'

const STORAGE_KEY = 'cosider_historique'

const modePleinEcran = ref(false)
const historiqueOuvert = ref(true)
const conversations = ref([])
const conversationActiveId = ref(null)
const rechercheHistorique = ref('')
const messages = ref([])
const saisie = ref('')
const zoneMessages = ref(null)

const suggestions = [
  {
    icone: '▤',
    titre: 'Résumer un document',
    description: 'Extraire les informations essentielles',
    question: 'Peux-tu résumer les points importants de ce document ?'
  },
  {
    icone: '✦',
    titre: 'Analyser un rapport',
    description: 'Comprendre les résultats et conclusions',
    question: 'Quels sont les principaux résultats de ce rapport ?'
  },
  {
    icone: '⌕',
    titre: 'Rechercher une information',
    description: 'Retrouver une information précise',
    question: 'Quelles informations importantes contient ce fichier ?'
  },
  {
    icone: '✓',
    titre: 'Vérifier une procédure',
    description: 'Examiner les étapes et les exigences',
    question: 'Quelles sont les étapes principales de cette procédure ?'
  }
]

const conversationCommencee = computed(() => messages.value.length > 0)

const conversationsFiltrees = computed(() => {
  const recherche = rechercheHistorique.value.trim().toLowerCase()

  return [...conversations.value]
    .filter(c => (c.titre || '').toLowerCase().includes(recherche))
    .sort((a, b) => (b.modifieLe || 0) - (a.modifieLe || 0))
})

function sauvegarderHistorique() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.value))
  } catch (erreur) {
    console.error('Impossible de sauvegarder l’historique :', erreur)
  }
}

function chargerHistorique() {
  try {
    const donnees = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    conversations.value = Array.isArray(donnees) ? donnees : []
  } catch (erreur) {
    conversations.value = []
    console.error('Impossible de charger l’historique :', erreur)
  }
}

function agrandirAssistant() {
  modePleinEcran.value = true
  historiqueOuvert.value = true
  nextTick(defilerEnBas)
}

function reduireAssistant() {
  modePleinEcran.value = false
  historiqueOuvert.value = false
}

function basculerPleinEcran() {
  if (modePleinEcran.value) {
    reduireAssistant()
  } else {
    agrandirAssistant()
  }
}

function basculerHistorique() {
  historiqueOuvert.value = !historiqueOuvert.value
}

function nouvelleConversation() {
  conversationActiveId.value = null
  messages.value = []
  saisie.value = ''
  nextTick(defilerEnBas)
}

function ouvrirConversation(conversation) {
  conversationActiveId.value = conversation.id
  messages.value = Array.isArray(conversation.messages)
    ? [...conversation.messages]
    : []
  saisie.value = ''
  nextTick(defilerEnBas)
}

function utiliserSuggestion(question) {
  saisie.value = question
}

function defilerEnBas() {
  if (zoneMessages.value) {
    zoneMessages.value.scrollTop = zoneMessages.value.scrollHeight
  }
}

async function envoyerMessage() {
  const texte = saisie.value.trim()
  if (!texte) return

  const maintenant = Date.now()

  messages.value.push({
    id: `${maintenant}-${Math.random()}`,
    role: 'user',
    contenu: texte,
    heure: new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  saisie.value = ''

  let conversation = conversations.value.find(
    c => c.id === conversationActiveId.value
  )

  if (!conversation) {
    conversation = {
      id: `${maintenant}-${Math.random().toString(36).slice(2)}`,
      titre: texte.slice(0, 45),
      messages: [],
      modifieLe: maintenant
    }

    conversations.value.unshift(conversation)
    conversationActiveId.value = conversation.id
  }

  conversation.messages = [...messages.value]
  conversation.modifieLe = maintenant

  sauvegarderHistorique()
  await nextTick()
  defilerEnBas()
}

function supprimerConversation(id) {
  const conversation = conversations.value.find(c => c.id === id)
  if (!conversation) return

  if (!window.confirm(`Supprimer « ${conversation.titre} » ?`)) return

  conversations.value = conversations.value.filter(c => c.id !== id)

  if (conversationActiveId.value === id) {
    nouvelleConversation()
  }

  sauvegarderHistorique()
}

function renommerConversation(conversation) {
  const titre = window.prompt(
    'Nouveau nom de la conversation :',
    conversation.titre
  )

  if (!titre || !titre.trim()) return

  conversation.titre = titre.trim()
  conversation.modifieLe = Date.now()
  sauvegarderHistorique()
}

function gererClavier(event) {
  if (event.key === 'Escape' && modePleinEcran.value) {
    reduireAssistant()
  }
}

watch(modePleinEcran, actif => {
  document.body.style.overflow = actif ? 'hidden' : ''
})

onMounted(() => {
  chargerHistorique()
  window.addEventListener('keydown', gererClavier)
})

onUnmounted(() => {
  window.removeEventListener('keydown', gererClavier)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="chat-page">

    <!-- TITRE DE LA PAGE NORMALE -->
    <header class="page-header">
      <div>
        <div class="eyebrow">
          <span class="eyebrow-line"></span>
          COSIDER CONSTRUCTION · INTELLIGENCE ARTIFICIELLE
        </div>

        <h1>
          Votre assistant <span>intelligent.</span>
        </h1>

        <p>
          Une nouvelle façon d'explorer, de comprendre
          et d'analyser vos documents.
        </p>
      </div>

      <button
        type="button"
        class="new-chat-btn"
        @click="nouvelleConversation"
      >
        <span class="plus-icon">+</span>
        Nouvelle conversation
      </button>
    </header>

    <!-- BANNIÈRE CHANTIER -->
    <section class="hero-banner">
      <div class="hero-copy">
        <span class="hero-pill">
          ✦ VOTRE ESPACE DE TRAVAIL INTELLIGENT
        </span>

        <h2>
          L'intelligence artificielle<br />
          au service de <span>vos projets.</span>
        </h2>

        <p>
          Posez vos questions, explorez vos documents
          et préparez vos analyses en quelques instants.
        </p>

        <div class="hero-indicator">
          <span class="indicator-dot"></span>
          Interface prête à vous accueillir
        </div>
      </div>

      <div class="hero-photo" aria-hidden="true"></div>
      <div class="hero-red-shape" aria-hidden="true"></div>
    </section>

    <!-- ESPACE ASSISTANT -->
    <div
      class="assistant-workspace"
      :class="{ 'mode-plein-ecran': modePleinEcran }"
    >

      <!-- HISTORIQUE BLANC MODERNE -->
      <aside
        v-if="modePleinEcran"
        class="chat-history"
        :class="{ 'chat-history-hidden': !historiqueOuvert }"
      >
        <div class="history-content">

          <div class="history-heading">
            <div>
              <strong>Conversations</strong>
              <small>HISTORIQUE COSIDER AI</small>
            </div>

            <button
              type="button"
              class="history-close"
              title="Fermer l'historique"
              @click="basculerHistorique"
            >
              ×
            </button>
          </div>

          <button
            type="button"
            class="history-new-button"
            @click="nouvelleConversation"
          >
            <span>＋</span>
            Nouvelle conversation
          </button>

          <div class="history-search">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 5 5" />
            </svg>

            <input
              v-model="rechercheHistorique"
              type="search"
              placeholder="Rechercher une conversation..."
            />
          </div>

          <div class="history-items">
            <p class="history-section-title">Vos discussions</p>

            <div
              v-for="conversation in conversationsFiltrees"
              :key="conversation.id"
              class="history-item"
              :class="{
                'history-item-active':
                  conversationActiveId === conversation.id
              }"
            >
              <button
                type="button"
                class="history-item-title"
                @click="ouvrirConversation(conversation)"
              >
                <svg
                  class="history-item-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  aria-hidden="true"
                >
                  <path
                    d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5
                       9 9 0 0 1-4-.9L3 20l.9-4.5
                       A8.5 8.5 0 1 1 20 11.5Z"
                  />
                </svg>

                <span class="history-item-name">
                  {{ conversation.titre }}
                </span>
              </button>

              <div class="history-actions">
                <button
                  type="button"
                  title="Renommer"
                  @click="renommerConversation(conversation)"
                >
                  ✎
                </button>

                <button
                  type="button"
                  title="Supprimer"
                  @click="supprimerConversation(conversation.id)"
                >
                  ×
                </button>
              </div>
            </div>

            <p
              v-if="conversationsFiltrees.length === 0"
              class="history-empty"
            >
              {{
                rechercheHistorique
                  ? 'Aucune conversation trouvée.'
                  : 'Vos conversations apparaîtront ici.'
              }}
            </p>
          </div>

          <div class="history-bottom">
            <span class="history-bottom-dot"></span>
            Historique enregistré localement
          </div>
        </div>
      </aside>

      <!-- PARTIE ASSISTANT -->
      <div class="assistant-column">

        <!-- BOUTONS PLEIN ÉCRAN -->
        <div class="history-toggle-bar">
          <div class="toggle-left">
            <button
              type="button"
              class="history-toggle-button"
              :title="
                modePleinEcran
                  ? 'Réduire l’assistant'
                  : 'Agrandir l’assistant'
              "
              @click="basculerPleinEcran"
            >
              <svg
                v-if="!modePleinEcran"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />
              </svg>

              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                aria-hidden="true"
              >
                <path d="M3 9h6V3M21 9h-6V3M3 15h6v6M21 15h-6v6" />
              </svg>
            </button>

            <span class="toggle-label">
              {{ modePleinEcran ? 'Réduire' : 'Agrandir' }}
            </span>

            <button
              v-if="modePleinEcran"
              type="button"
              class="history-toggle-button"
              :title="
                historiqueOuvert
                  ? 'Masquer les conversations'
                  : 'Afficher les conversations'
              "
              @click="basculerHistorique"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M9 4v16" />
              </svg>
            </button>
          </div>

          <span v-if="modePleinEcran" class="fullscreen-label">
            <strong>COSIDER AI</strong> · Mode plein écran
          </span>
        </div>

        <!-- PANNEAU CHAT -->
        <section class="assistant-panel">

          <div class="panel-topbar">
            <div class="assistant-info">
              <div class="assistant-icon">✦</div>

              <div>
                <strong>COSIDER AI Assistant</strong>
                <span>Votre espace de conversation</span>
              </div>
            </div>

            <span class="demo-status">
              <span class="status-dot"></span>
              Mode démonstration
            </span>
          </div>

          <!-- MESSAGES ET ACCUEIL -->
          <div ref="zoneMessages" class="chat-messages">

            <!-- ACCUEIL AVEC ROBOT -->
            <div v-if="!conversationCommencee" class="welcome">

              <div class="robot-area">
                <div class="robot-glow"></div>

                <svg
                  class="robot-svg"
                  viewBox="0 0 200 180"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M100 38 V23"
                    stroke="#aeb8c5"
                    stroke-width="6"
                    stroke-linecap="round"
                  />

                  <circle cx="100" cy="19" r="9" fill="#d50025" />

                  <rect
                    x="25" y="72"
                    width="20" height="40" rx="9"
                    fill="#cdd4dd"
                  />

                  <rect
                    x="155" y="72"
                    width="20" height="40" rx="9"
                    fill="#cdd4dd"
                  />

                  <rect
                    x="36" y="42"
                    width="128" height="102" rx="34"
                    fill="#e9edf2"
                    stroke="#cdd4dd"
                    stroke-width="3"
                  />

                  <rect
                    x="49" y="57"
                    width="102" height="70" rx="24"
                    fill="#283448"
                  />

                  <ellipse
                    cx="78" cy="90" rx="9" ry="12"
                    fill="#ffffff"
                  />

                  <ellipse
                    cx="122" cy="90" rx="9" ry="12"
                    fill="#ffffff"
                  />

                  <path
                    d="M87 110 Q100 121 113 110"
                    fill="none"
                    stroke="#ff6d82"
                    stroke-width="4"
                    stroke-linecap="round"
                  />

                  <rect
                    x="67" y="143"
                    width="66" height="28" rx="14"
                    fill="#c90023"
                  />

                  <rect
                    x="88" y="149"
                    width="24" height="14" rx="7"
                    fill="#ffffff"
                  />
                </svg>

                <span class="robot-sparkle sparkle-one">✦</span>
                <span class="robot-sparkle sparkle-two">✧</span>
              </div>

              <span class="welcome-kicker">
                BONJOUR ET BIENVENUE
              </span>

              <h2>
                Comment puis-je
                <span>vous accompagner ?</span>
              </h2>

              <p class="welcome-description">
                Votre assistant COSIDER AI vous accompagne
                dans l'exploration de vos documents
                et la préparation de vos analyses.
              </p>

              <div class="section-title">
                <span>POUR COMMENCER</span>
                <div></div>
              </div>

              <div class="suggestions-grid">
                <button
                  v-for="suggestion in suggestions"
                  :key="suggestion.titre"
                  type="button"
                  class="suggestion-card"
                  @click="utiliserSuggestion(suggestion.question)"
                >
                  <span class="suggestion-icon">
                    {{ suggestion.icone }}
                  </span>

                  <span class="suggestion-text">
                    <strong>{{ suggestion.titre }}</strong>
                    <small>{{ suggestion.description }}</small>
                  </span>

                  <span class="suggestion-arrow">↗</span>
                </button>
              </div>
            </div>

            <!-- CONVERSATION -->
            <div v-else class="conversation">
              <div class="conversation-date">
                Conversation actuelle
              </div>

              <div
                v-for="message in messages"
                :key="message.id"
                class="message-row"
              >
                <div class="user-avatar">V</div>

                <div class="message-content">
                  <div class="message-header">
                    <strong>Vous</strong>
                    <span>{{ message.heure }}</span>
                  </div>

                  <div class="message-bubble">
                    {{ message.contenu }}
                  </div>
                </div>
              </div>

              <div class="demo-notice">
                <div class="notice-icon">✦</div>

                <div>
                  <strong>Assistant IA en préparation</strong>

                  <p>
                    Votre message a été enregistré.
                    Les réponses automatiques seront disponibles
                    après la connexion du moteur IA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ZONE DE SAISIE -->
          <div class="composer-area">
            <div class="composer">
              <textarea
                v-model="saisie"
                rows="2"
                placeholder="Écrivez votre question à COSIDER AI..."
                aria-label="Votre question"
                @keydown.enter.exact.prevent="envoyerMessage"
              ></textarea>

              <div class="composer-bottom">
                <span class="composer-label">
                  ✦ Votre espace intelligent
                </span>

                <button
                  type="button"
                  class="send-button"
                  :disabled="!saisie.trim()"
                  aria-label="Envoyer le message"
                  @click="envoyerMessage"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path d="m5 12 14-7-4 14-3-6-7-1Z" />
                    <path d="m12 13 7-8" />
                  </svg>
                </button>
              </div>
            </div>

            <p class="footer-note">
              COSIDER AI · Plateforme intelligente
              <span>— Interface de démonstration</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========================================
   PAGE COSIDER
======================================== */

.chat-page {
  width: 100%;
  max-width: 1550px;
  margin: 0 auto;
  padding-bottom: 28px;
  color: #222733;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
}

.chat-page * {
  box-sizing: border-box;
}

button,
input,
textarea {
  font-family: inherit;
}

/* ========================================
   EN-TÊTE
======================================== */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 24px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #c40024;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.eyebrow-line {
  width: 20px;
  height: 3px;
  background: #c90023;
  border-radius: 5px;
}

.page-header h1 {
  font-size: clamp(27px, 3vw, 36px);
  font-weight: 800;
  letter-spacing: -1px;
  margin: 12px 0 8px;
}

.page-header h1 span {
  color: #c90023;
}

.page-header p {
  font-size: 12px;
  line-height: 1.8;
  color: #9299a5;
}

.new-chat-btn {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 17px;
  border: 1px solid #c90023;
  background: #c90023;
  color: white;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 7px 17px #c900231a;
}

.new-chat-btn:hover {
  background: #a9001c;
}

.plus-icon {
  font-size: 20px;
  font-weight: 400;
  line-height: 1;
}

/* ========================================
   BANNIÈRE CHANTIER
======================================== */

.hero-banner {
  position: relative;
  min-height: 230px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(110deg, #8e0018, #d10025);
  border-radius: 17px;
  margin-bottom: 23px;
  isolation: isolate;
}

.hero-copy {
  position: relative;
  z-index: 3;
  padding: 30px 37px;
  width: 65%;
  color: white;
}

.hero-pill {
  display: inline-block;
  border: 1px solid #ffffff50;
  background: #ffffff20;
  border-radius: 6px;
  padding: 7px 10px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
  margin-bottom: 14px;
}

.hero-copy h2 {
  font-size: clamp(23px, 2.8vw, 34px);
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.6px;
  margin: 0 0 12px;
}

.hero-copy h2 span {
  color: #ffd7df;
}

.hero-copy p {
  font-size: 12px;
  line-height: 1.8;
  max-width: 480px;
  color: #ffe7ec;
}

.hero-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  font-size: 10px;
  font-weight: 700;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: #8ef1ad;
  border-radius: 50%;
}

.hero-photo {
  position: absolute;
  z-index: 1;
  top: 0;
  right: 0;
  bottom: 0;
  width: 48%;
  background-image:
    linear-gradient(90deg, #b80022aa, #1b1b1b12),
    url('/images/chantier.jpg');
  background-size: cover;
  background-position: center;
  clip-path: polygon(28% 0, 100% 0, 100% 100%, 0 100%);
}

.hero-red-shape {
  position: absolute;
  z-index: 2;
  right: -55px;
  bottom: -100px;
  width: 220px;
  height: 300px;
  background: #e3002c;
  transform: rotate(38deg);
  opacity: 0.85;
}

/* ========================================
   ESPACE ASSISTANT
======================================== */

.assistant-workspace {
  display: flex;
  width: 100%;
  min-width: 0;
  align-items: stretch;
}

.assistant-column {
  flex: 1;
  min-width: 0;
}

/* ========================================
   HISTORIQUE BLANC MODERNE
======================================== */

.chat-history {
  width: 290px;
  min-width: 290px;
  overflow: hidden;
  background: #fafbfc;
  color: #202633;
  border-right: 1px solid #e6e8ed;
  border-radius: 15px 0 0 15px;
  transition:
    width 0.3s ease,
    min-width 0.3s ease,
    opacity 0.3s ease;
}

.chat-history.chat-history-hidden {
  width: 0;
  min-width: 0;
  opacity: 0;
  pointer-events: none;
}

.history-content {
  width: 290px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px 13px;
}

.history-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px 22px;
}

.history-heading > div {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.history-heading strong {
  color: #202633;
  font-size: 18px;
  font-weight: 800;
}

.history-heading small {
  font-size: 9px;
  letter-spacing: 1.3px;
  color: #777f8d;
  font-weight: 700;
}

.history-close {
  border: none;
  background: transparent;
  color: #323946;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
}

.history-close:hover {
  color: #c90023;
}

.history-new-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 14px;
  border: none;
  border-radius: 10px;
  background: #c90023;
  color: white;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 5px 12px #c900231a;
}

.history-new-button span {
  font-size: 20px;
}

.history-new-button:hover {
  background: #a9001c;
}

.history-search {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 18px;
  padding: 12px;
  border: 1px solid #e1e5eb;
  border-radius: 10px;
  background: #ffffff;
}

.history-search:focus-within {
  border-color: #c90023;
  box-shadow: 0 0 0 3px #c900230f;
}

.history-search svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  color: #778190;
}

.history-search input {
  width: 100%;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: #202633;
  font-size: 11px;
}

.history-search input::placeholder {
  color: #9199a6;
}

.history-items {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-top: 22px;
}

.history-section-title {
  color: #343b47;
  font-size: 12px;
  font-weight: 800;
  margin: 0 7px 13px;
}

.history-item {
  display: flex;
  align-items: center;
  border-radius: 9px;
  margin-bottom: 6px;
  transition: background 0.2s ease;
}

.history-item:hover {
  background: #f5e9ec;
}

.history-item.history-item-active {
  background: #fde9ed;
  border-left: 3px solid #c90023;
}

.history-item-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  padding: 12px 8px;
  background: transparent;
  border: none;
  color: #29313e;
  cursor: pointer;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
}

.history-item-active .history-item-title {
  color: #a9001d;
  font-weight: 800;
}

.history-item-icon {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
  color: #c90023;
}

.history-item-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.history-actions {
  display: flex;
  gap: 2px;
  padding-right: 5px;
}

.history-actions button {
  border: none;
  background: transparent;
  color: #778190;
  cursor: pointer;
  font-size: 15px;
  padding: 4px;
}

.history-actions button:hover {
  color: #c90023;
}

.history-empty {
  color: #8a93a1;
  font-size: 11px;
  text-align: center;
  margin-top: 30px;
  line-height: 1.8;
}

.history-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #e3e6eb;
  padding: 18px 5px 3px;
  font-size: 10px;
  color: #737c89;
}

.history-bottom-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
}

/* ========================================
   BOUTONS AGRANDIR / RÉDUIRE
======================================== */

.history-toggle-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background: white;
  border: 1px solid #e9ebf0;
  border-bottom: none;
  border-radius: 13px 13px 0 0;
}

.toggle-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-label {
  font-size: 11px;
  font-weight: 700;
  color: #7e8794;
}

.history-toggle-button {
  width: 35px;
  height: 35px;
  display: grid;
  place-items: center;
  border: 1px solid #e4e6ec;
  border-radius: 8px;
  background: white;
  color: #252a35;
  cursor: pointer;
}

.history-toggle-button:hover {
  color: #c90023;
  background: #fff1f3;
}

.history-toggle-button svg {
  width: 20px;
  height: 20px;
}

.fullscreen-label {
  font-size: 11px;
  font-weight: 700;
  color: #8a93a1;
}

.fullscreen-label strong {
  color: #c90023;
}

/* ========================================
   PANNEAU ASSISTANT
======================================== */

.assistant-panel {
  background: white;
  border: 1px solid #e9ebf0;
  border-radius: 0 0 17px 17px;
  box-shadow: 0 8px 28px #18203308;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 620px;
}

.panel-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 17px 25px;
  border-bottom: 1px solid #eff0f3;
}

.assistant-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.assistant-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(145deg, #e11b3c, #a8001c);
  font-size: 24px;
}

.assistant-info > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.assistant-info strong {
  font-size: 13px;
  font-weight: 800;
}

.assistant-info span {
  font-size: 10px;
  color: #99a0ab;
}

.demo-status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 30px;
  background: #fff5e9;
  color: #a97825;
  font-size: 10px;
  font-weight: 700;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #dfa13c;
}

/* ========================================
   ACCUEIL
======================================== */

.chat-messages {
  flex: 1;
  min-height: 390px;
  max-height: 700px;
  overflow-y: auto;
  background:
    radial-gradient(circle at 50% 10%, #fff3f5 0, transparent 45%),
    #ffffff;
  padding: 25px;
}

.welcome {
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 5px 0 25px;
}

.robot-area {
  position: relative;
  width: 170px;
  height: 145px;
  margin-bottom: 12px;
}

.robot-glow {
  position: absolute;
  width: 140px;
  height: 125px;
  left: 15px;
  top: 15px;
  border-radius: 50%;
  background: #ffe6eb;
  filter: blur(10px);
}

.robot-svg {
  position: relative;
  z-index: 1;
  width: 170px;
  height: 145px;
  filter: drop-shadow(0 9px 10px #bd14301c);
}

.robot-sparkle {
  position: absolute;
  z-index: 2;
  color: #d30026;
  font-size: 22px;
}

.sparkle-one {
  left: 2px;
  top: 30px;
}

.sparkle-two {
  right: 1px;
  bottom: 23px;
}

.welcome-kicker {
  font-size: 10px;
  font-weight: 800;
  color: #c90023;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.welcome h2 {
  font-size: clamp(25px, 3vw, 34px);
  font-weight: 800;
  line-height: 1.35;
  letter-spacing: -0.7px;
  margin: 0;
}

.welcome h2 span {
  display: block;
  color: #c90023;
}

.welcome-description {
  max-width: 510px;
  color: #929aa7;
  font-size: 12px;
  line-height: 1.9;
  margin: 14px 0 28px;
}

.section-title {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 16px;
}

.section-title span {
  font-size: 10px;
  font-weight: 800;
  color: #a0a6b0;
  letter-spacing: 1.5px;
  white-space: nowrap;
}

.section-title div {
  height: 1px;
  background: #eceef2;
  flex: 1;
}

/* ========================================
   CARTES DE SUGGESTIONS
======================================== */

.suggestions-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}

.suggestion-card {
  display: flex;
  align-items: center;
  text-align: left;
  gap: 14px;
  position: relative;
  padding: 17px;
  background: white;
  border: 1px solid #e9ecf1;
  border-radius: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.suggestion-card:hover {
  border-color: #e6a4b0;
  background: #fff9fa;
  transform: translateY(-2px);
  box-shadow: 0 8px 22px #c9002310;
}

.suggestion-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 12px;
  background: #fff0f3;
  color: #c90023;
  font-size: 24px;
}

.suggestion-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-right: 12px;
}

.suggestion-text strong {
  font-size: 12px;
  font-weight: 800;
  color: #2a303a;
}

.suggestion-text small {
  font-size: 10px;
  color: #9ba2ae;
  line-height: 1.5;
}

.suggestion-arrow {
  position: absolute;
  right: 12px;
  top: 13px;
  font-size: 15px;
  color: #bfc4cc;
}

.suggestion-card:hover .suggestion-arrow {
  color: #c90023;
}

/* ========================================
   CONVERSATION
======================================== */

.conversation {
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.conversation-date {
  text-align: center;
  font-size: 10px;
  color: #a0a7b2;
  margin: 12px 0;
}

.message-row {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  gap: 12px;
}

.user-avatar {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 11px;
  background: #fff0f3;
  color: #c90023;
  font-weight: 800;
  font-size: 12px;
}

.message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
  max-width: 80%;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
}

.message-header span {
  color: #a0a7b2;
  font-size: 10px;
}

.message-bubble {
  padding: 13px 17px;
  background: #c90023;
  color: white;
  border-radius: 15px 4px 15px 15px;
  font-size: 12px;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.demo-notice {
  display: flex;
  gap: 12px;
  padding: 17px;
  background: #fff9fa;
  border: 1px solid #f2dfe3;
  border-radius: 13px;
}

.notice-icon {
  width: 37px;
  height: 37px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: #fff0f3;
  color: #c90023;
  font-size: 23px;
}

.demo-notice strong {
  font-size: 12px;
}

.demo-notice p {
  margin-top: 7px;
  font-size: 11px;
  line-height: 1.8;
  color: #8993a0;
}

/* ========================================
   ZONE DE SAISIE
======================================== */

.composer-area {
  border-top: 1px solid #eef0f3;
  padding: 18px 25px 14px;
  background: white;
}

.composer {
  max-width: 850px;
  margin: 0 auto;
  padding: 13px 15px;
  border: 1px solid #e4e8ee;
  border-radius: 13px;
  background: #fcfcfd;
}

.composer:focus-within {
  border-color: #d77a8b;
  box-shadow: 0 0 0 4px #c9002309;
}

.composer textarea {
  display: block;
  width: 100%;
  min-height: 48px;
  max-height: 150px;
  border: none;
  outline: none;
  background: transparent;
  resize: vertical;
  font: inherit;
  font-size: 12px;
  line-height: 1.7;
  color: #283140;
}

.composer textarea::placeholder {
  color: #a0a7b3;
}

.composer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.composer-label {
  color: #9ba3af;
  font-size: 10px;
}

.send-button {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: none;
  border-radius: 10px;
  background: #c90023;
  color: white;
  cursor: pointer;
}

.send-button:hover:not(:disabled) {
  background: #a9001d;
}

.send-button:disabled {
  background: #e6c5cc;
  cursor: not-allowed;
}

.send-button svg {
  width: 19px;
  height: 19px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.footer-note {
  text-align: center;
  color: #a4abb5;
  font-size: 10px;
  margin: 12px 0 0;
}

/* ========================================
   MODE NORMAL
======================================== */

.assistant-workspace:not(.mode-plein-ecran) .chat-history {
  display: none;
}

/* ========================================
   MODE PLEIN ÉCRAN
======================================== */

.assistant-workspace.mode-plein-ecran {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  max-width: none;
  z-index: 999999;
  background: #ffffff;
  display: flex;
  overflow: hidden;
  border-radius: 0;
}

.mode-plein-ecran .chat-history {
  display: block;
  width: 290px;
  min-width: 290px;
  height: 100%;
  opacity: 1;
  background: #fafbfc;
  color: #202633;
  border-radius: 0;
  flex-shrink: 0;
  pointer-events: auto;
}

.mode-plein-ecran .chat-history.chat-history-hidden {
  width: 0;
  min-width: 0;
  opacity: 0;
  pointer-events: none;
}

.mode-plein-ecran .assistant-column {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mode-plein-ecran .history-toggle-bar {
  flex-shrink: 0;
  border-radius: 0;
  padding: 13px 20px;
  border-bottom: 1px solid #edf0f3;
}

.mode-plein-ecran .assistant-panel {
  flex: 1;
  min-height: 0;
  height: 100%;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.mode-plein-ecran .chat-messages {
  flex: 1;
  min-height: 0;
  max-height: none;
  overflow-y: auto;
}

.mode-plein-ecran .welcome {
  min-height: 100%;
  justify-content: center;
}

.mode-plein-ecran .composer-area {
  flex-shrink: 0;
  padding: 15px 30px;
}

/* ========================================
   RESPONSIVE
======================================== */

@media (max-width: 900px) {
  .hero-copy {
    width: 80%;
  }

  .hero-photo {
    opacity: 0.4;
    width: 65%;
  }
}

@media (max-width: 700px) {
  .page-header {
    align-items: flex-start;
  }

  .hero-banner {
    min-height: 250px;
  }

  .hero-copy {
    width: 100%;
    padding: 25px;
  }

  .hero-photo {
    width: 100%;
    opacity: 0.18;
  }

  .hero-red-shape {
    opacity: 0.25;
  }

  .panel-topbar,
  .chat-messages,
  .composer-area {
    padding-left: 15px;
    padding-right: 15px;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .demo-status,
  .footer-note span {
    display: none;
  }

  .message-content {
    max-width: 85%;
  }

  .mode-plein-ecran .chat-history {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    width: 260px;
    min-width: 260px;
    box-shadow: 6px 0 24px #1923321a;
  }

  .mode-plein-ecran .chat-history.chat-history-hidden {
    width: 260px;
    min-width: 260px;
    transform: translateX(-100%);
    opacity: 0;
  }

  .mode-plein-ecran .history-content {
    width: 260px;
  }

  .fullscreen-label {
    display: none;
  }
}
</style>
