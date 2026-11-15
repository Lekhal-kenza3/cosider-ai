
<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted, watch } from 'vue'

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

const conversationsFiltrees = computed(() =>
  [...conversations.value]
    .filter(c =>
      (c.titre || '')
        .toLowerCase()
        .includes(rechercheHistorique.value.trim().toLowerCase())
    )
    .sort((a, b) => (b.modifieLe || 0) - (a.modifieLe || 0))
)

function sauvegarderHistorique() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations.value))
  } catch (e) {
    console.error('Erreur sauvegarde historique :', e)
  }
}

function chargerHistorique() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    conversations.value = Array.isArray(data) ? data : []
  } catch (e) {
    conversations.value = []
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

    <!-- EN-TÊTE -->
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

      <button class="new-chat-btn" @click="nouvelleConversation">
        + Nouvelle conversation
      </button>
    </header>

    <!-- BANNIÈRE -->
    <section class="hero-banner">
      <div class="hero-copy">
        <span class="hero-pill">
          ✦ VOTRE ESPACE DE TRAVAIL INTELLIGENT
        </span>

        <h2>
          L'intelligence artificielle<br>
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

      <div class="hero-photo"></div>
      <div class="hero-red-shape"></div>
    </section>

    <!-- ESPACE ASSISTANT -->
    <div
      class="assistant-workspace"
      :class="{ 'mode-plein-ecran': modePleinEcran }"
    >

      <!-- HISTORIQUE -->
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
              class="history-close"
              title="Masquer l'historique"
              @click="basculerHistorique"
            >
              ×
            </button>
          </div>

          <button
            class="history-new-button"
            @click="nouvelleConversation"
          >
            ＋ Nouvelle conversation
          </button>

          <div class="history-search">
            <span>⌕</span>
            <input
              v-model="rechercheHistorique"
              placeholder="Rechercher une conversation..."
            >
          </div>

          <div class="history-items">
            <p class="history-section-title">
              Vos discussions
            </p>

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
                class="history-item-title"
                @click="ouvrirConversation(conversation)"
              >
                <span class="history-item-icon">▤</span>
                <span class="history-item-name">
                  {{ conversation.titre }}
                </span>
              </button>

              <div class="history-actions">
                <button
                  title="Renommer"
                  @click="renommerConversation(conversation)"
                >
                  ✎
                </button>

                <button
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

      <!-- COLONNE PRINCIPALE -->
      <div class="assistant-column">

        <!-- COMMANDES -->
        <div class="history-toggle-bar">
          <div class="toggle-left">
            <button
              class="history-toggle-button"
              :title="modePleinEcran ? 'Réduire' : 'Agrandir'"
              @click="basculerPleinEcran"
            >
              {{ modePleinEcran ? '↙' : '⛶' }}
            </button>

            <span class="toggle-label">
              {{ modePleinEcran ? 'Réduire' : 'Agrandir' }}
            </span>

            <button
              v-if="modePleinEcran"
              class="history-toggle-button"
              title="Afficher ou masquer l'historique"
              @click="basculerHistorique"
            >
              ☰
            </button>
          </div>

          <span
            v-if="modePleinEcran"
            class="fullscreen-label"
          >
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

          <!-- MESSAGES -->
          <div
            ref="zoneMessages"
            class="chat-messages"
          >

            <!-- ACCUEIL -->
            <div
              v-if="!conversationCommencee"
              class="welcome"
            >

              <!-- NOUVEAU ROBOT COSIDER -->
              <div class="robot-area">
                <div class="robot-glow"></div>

                <img
                  src="/images/robot-cosider.png"
                  alt="Mascotte robot COSIDER AI avec casque de chantier"
                  class="robot-image"
                >
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
                @keydown.enter.exact.prevent="envoyerMessage"
              ></textarea>

              <div class="composer-bottom">
                <span class="composer-label">
                  ✦ Votre espace intelligent
                </span>

                <button
                  class="send-button"
                  :disabled="!saisie.trim()"
                  title="Envoyer"
                  @click="envoyerMessage"
                >
                  ➤
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
* {
  box-sizing: border-box;
}

.chat-page {
  width: 100%;
  max-width: 1550px;
  margin: 0 auto;
  padding: 28px 30px 40px;
  font-family: 'DM Sans', 'Segoe UI', Arial, sans-serif;
  color: #242832;
}

/* EN-TÊTE */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a60a27;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
}

.eyebrow-line {
  width: 22px;
  height: 2px;
  background: #c90023;
}

.page-header h1 {
  font-size: clamp(25px, 3vw, 37px);
  line-height: 1.2;
  margin: 0 0 10px;
  font-weight: 800;
  letter-spacing: -1px;
}

.page-header h1 span {
  color: #c90023;
}

.page-header p {
  margin: 0;
  color: #858b97;
  font-size: 13px;
}

.new-chat-btn {
  border: none;
  border-radius: 10px;
  background: #c90023;
  color: white;
  padding: 13px 19px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.new-chat-btn:hover {
  background: #a8001d;
}

/* BANNIÈRE */

.hero-banner {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 205px;
  border-radius: 17px;
  overflow: hidden;
  background: linear-gradient(
    115deg,
    #a6001e 0%,
    #d20b2c 65%,
    #ef3a4e 100%
  );
  margin-bottom: 24px;
}

.hero-copy {
  position: relative;
  z-index: 3;
  width: 65%;
  padding: 30px 36px;
  color: white;
}

.hero-pill {
  display: inline-block;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.1px;
  padding: 7px 11px;
  border: 1px solid rgba(255,255,255,.35);
  border-radius: 20px;
  background: rgba(255,255,255,.1);
  margin-bottom: 13px;
}

.hero-copy h2 {
  margin: 0 0 10px;
  font-size: clamp(20px, 2.4vw, 30px);
  line-height: 1.24;
  letter-spacing: -.5px;
}

.hero-copy h2 span {
  color: #ffe0e4;
}

.hero-copy p {
  max-width: 430px;
  font-size: 12px;
  line-height: 1.7;
  color: #ffe4e8;
  margin: 0 0 16px;
}

.hero-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: #fff2f4;
}

.indicator-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(255,255,255,.15);
}

.hero-photo {
  position: absolute;
  inset: 0 0 0 52%;
  background:
    linear-gradient(90deg, #c90023 0%, transparent 55%),
    url('/images/chantier.jpg') center / cover;
  opacity: .65;
}

.hero-red-shape {
  position: absolute;
  width: 270px;
  height: 270px;
  right: 20%;
  top: -150px;
  border: 55px solid rgba(255,255,255,.07);
  border-radius: 50%;
}

/* ESPACE CHAT */

.assistant-workspace {
  display: flex;
  width: 100%;
  min-height: 630px;
  background: white;
  border: 1px solid #eceef2;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 30px rgba(22,29,43,.035);
}

.assistant-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.history-toggle-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 18px;
  min-height: 48px;
  background: #fff;
  border-bottom: 1px solid #f0f0f2;
}

.toggle-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-toggle-button {
  display: grid;
  place-items: center;
  width: 31px;
  height: 31px;
  background: #f7f8fa;
  color: #4b5563;
  border: 1px solid #e9ebef;
  border-radius: 7px;
  cursor: pointer;
  font-size: 17px;
}

.history-toggle-button:hover {
  background: #fff0f2;
  color: #c90023;
}

.toggle-label,
.fullscreen-label {
  font-size: 11px;
  color: #747c89;
}

.fullscreen-label strong {
  color: #c90023;
}

.assistant-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: white;
}

.panel-topbar {
  min-height: 65px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 12px 24px;
  border-bottom: 1px solid #f0f1f3;
}

.assistant-info {
  display: flex;
  align-items: center;
  gap: 11px;
}

.assistant-icon {
  display: grid;
  place-items: center;
  width: 37px;
  height: 37px;
  border-radius: 10px;
  background: #c90023;
  color: white;
  font-size: 22px;
}

.assistant-info strong {
  display: block;
  font-size: 13px;
  font-weight: 800;
}

.assistant-info span {
  display: block;
  color: #9299a4;
  font-size: 10px;
  margin-top: 4px;
}

.demo-status {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  color: #858b95;
  white-space: nowrap;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #24ad78;
}

/* MESSAGES */

.chat-messages {
  flex: 1;
  min-height: 0;
  max-height: 650px;
  overflow-y: auto;
  background:
    radial-gradient(
      ellipse at 50% 15%,
      rgba(255,238,241,.6),
      transparent 55%
    ),
    #fff;
}

.welcome {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  padding: 20px 30px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* NOUVEAU ROBOT COSIDER AI */

.robot-area {
  position: relative;
  width: 300px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 4px;
}

.robot-glow {
  position: absolute;
  width: 185px;
  height: 145px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    rgba(245,200,207,.32),
    transparent 70%
  );
  filter: blur(12px);
}

.robot-image {
  position: relative;
  z-index: 1;
  display: block;
  width: 300px;
  height: 250px;
  object-fit: contain;
  border-radius: 12px;
  mix-blend-mode: multiply;
}

/* TITRES ACCUEIL */

.welcome-kicker {
  font-size: 10px;
  font-weight: 800;
  color: #c90023;
  letter-spacing: 2px;
  margin-top: 8px;
  margin-bottom: 12px;
}

.welcome h2 {
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.3;
  letter-spacing: -.8px;
  font-weight: 800;
  margin: 0 0 12px;
}

.welcome h2 span {
  display: block;
  color: #c90023;
}

.welcome-description {
  max-width: 480px;
  margin: 0 auto 25px;
  font-size: 12px;
  line-height: 1.8;
  color: #8a919c;
}

.section-title {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  text-align: left;
}

.section-title span {
  color: #9a9fa9;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  white-space: nowrap;
}

.section-title div {
  flex: 1;
  height: 1px;
  background: #eceef1;
}

/* SUGGESTIONS */

.suggestions-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.suggestion-card {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 16px;
  min-height: 80px;
  border: 1px solid #ebedf0;
  border-radius: 11px;
  background: white;
  cursor: pointer;
  text-align: left;
  transition: .2s ease;
}

.suggestion-card:hover {
  border-color: #f2b6c0;
  background: #fff9fa;
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(190,0,35,.06);
}

.suggestion-icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff0f2;
  color: #c90023;
  font-size: 21px;
}

.suggestion-text {
  flex: 1;
  min-width: 0;
}

.suggestion-text strong {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #2d3038;
  margin-bottom: 5px;
}

.suggestion-text small {
  display: block;
  font-size: 10px;
  color: #9299a3;
  line-height: 1.4;
}

.suggestion-arrow {
  font-size: 17px;
  color: #c90023;
}

/* CONVERSATION */

.conversation {
  max-width: 850px;
  margin: 0 auto;
  padding: 25px;
}

.conversation-date {
  text-align: center;
  color: #a2a7b0;
  font-size: 11px;
  margin-bottom: 25px;
}

.message-row {
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
}

.user-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 35px;
  height: 35px;
  background: #c90023;
  color: white;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.message-header strong {
  font-size: 12px;
}

.message-header span {
  font-size: 10px;
  color: #a1a7b0;
}

.message-bubble {
  display: inline-block;
  max-width: 100%;
  padding: 13px 16px;
  background: #f6f7f9;
  border-radius: 0 12px 12px 12px;
  color: #424853;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.demo-notice {
  display: flex;
  gap: 12px;
  padding: 17px;
  border: 1px solid #f5d9de;
  background: #fff9fa;
  border-radius: 12px;
}

.notice-icon {
  color: #c90023;
  font-size: 21px;
}

.demo-notice strong {
  font-size: 12px;
}

.demo-notice p {
  margin: 6px 0 0;
  font-size: 11px;
  line-height: 1.7;
  color: #858c98;
}

/* COMPOSER */

.composer-area {
  padding: 16px 25px 13px;
  background: white;
  border-top: 1px solid #f0f1f3;
}

.composer {
  max-width: 850px;
  margin: 0 auto;
  border: 1px solid #e4e6eb;
  border-radius: 13px;
  padding: 12px 15px 9px;
  transition: border-color .2s;
}

.composer:focus-within {
  border-color: #d36b7e;
}

.composer textarea {
  display: block;
  width: 100%;
  resize: none;
  outline: none;
  border: none;
  background: transparent;
  color: #303640;
  font: inherit;
  font-size: 12px;
  line-height: 1.6;
}

.composer textarea::placeholder {
  color: #a2a8b1;
}

.composer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 7px;
}

.composer-label {
  font-size: 10px;
  color: #b0b5bd;
}

.send-button {
  display: grid;
  place-items: center;
  width: 33px;
  height: 33px;
  border: none;
  border-radius: 9px;
  background: #c90023;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.send-button:disabled {
  background: #e6e7eb;
  color: #b4b7bf;
  cursor: not-allowed;
}

.footer-note {
  margin: 10px 0 0;
  text-align: center;
  font-size: 10px;
  color: #9ca3ae;
}

.footer-note span {
  color: #b5bac2;
}

/* HISTORIQUE BLANC */

.chat-history {
  width: 290px;
  flex-shrink: 0;
  overflow: hidden;
  background: #fafbfc;
  border-right: 1px solid #e9ebef;
  transition: width .25s ease;
}

.chat-history-hidden {
  width: 0 !important;
  border-right: none;
}

.history-content {
  display: flex;
  flex-direction: column;
  width: 290px;
  height: 100%;
  min-height: 0;
  padding: 21px 14px 14px;
}

.history-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 0 7px 20px;
}

.history-heading strong {
  display: block;
  font-size: 18px;
  font-weight: 800;
  color: #242832;
}

.history-heading small {
  display: block;
  margin-top: 6px;
  color: #9ba2ad;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.3px;
}

.history-close {
  border: none;
  background: transparent;
  color: #9ba2ad;
  font-size: 23px;
  cursor: pointer;
}

.history-new-button {
  width: 100%;
  padding: 13px 12px;
  border: none;
  border-radius: 9px;
  background: #c90023;
  color: white;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  text-align: left;
}

.history-new-button:hover {
  background: #a9001d;
}

.history-search {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 0 11px;
  height: 39px;
  border: 1px solid #e8eaf0;
  border-radius: 8px;
  background: white;
}

.history-search span {
  color: #9da4ae;
  font-size: 20px;
}

.history-search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 11px;
  color: #4d5561;
}

.history-search input::placeholder {
  color: #adb3bd;
}

.history-items {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin-top: 22px;
}

.history-section-title {
  padding: 0 9px;
  margin: 0 0 12px;
  color: #a0a7b1;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .7px;
}

.history-item {
  display: flex;
  align-items: center;
  border-radius: 8px;
  margin-bottom: 5px;
  border-left: 3px solid transparent;
}

.history-item:hover {
  background: #f1f2f5;
}

.history-item-active {
  background: #fff0f2;
  border-left-color: #c90023;
}

.history-item-title {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 10px;
  min-width: 0;
  padding: 12px 7px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.history-item-icon {
  color: #a1a7b0;
  font-size: 16px;
}

.history-item-active .history-item-icon {
  color: #c90023;
}

.history-item-name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #505763;
  font-size: 11px;
}

.history-item-active .history-item-name {
  color: #b00020;
  font-weight: 700;
}

.history-actions {
  display: flex;
  align-items: center;
  padding-right: 5px;
}

.history-actions button {
  background: transparent;
  border: none;
  color: #a1a7b0;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
}

.history-actions button:hover {
  color: #c90023;
}

.history-empty {
  padding: 15px 10px;
  font-size: 11px;
  line-height: 1.7;
  color: #a1a7b0;
  text-align: center;
}

.history-bottom {
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #e9ebef;
  padding: 16px 7px 4px;
  font-size: 10px;
  color: #969da8;
}

.history-bottom-dot {
  width: 7px;
  height: 7px;
  background: #28b47b;
  border-radius: 50%;
}

/* MODE PLEIN ÉCRAN */

.assistant-workspace.mode-plein-ecran {
  position: fixed;
  inset: 0;
  z-index: 999999;
  width: 100vw;
  height: 100dvh;
  max-height: 100dvh;
  min-height: 0;
  border: none;
  border-radius: 0;
  background: white;
  overflow: hidden;
}

.mode-plein-ecran .chat-history {
  height: 100%;
}

.mode-plein-ecran .assistant-column {
  height: 100%;
}

.mode-plein-ecran .assistant-panel {
  flex: 1;
  min-height: 0;
}

.mode-plein-ecran .chat-messages {
  flex: 1;
  max-height: none;
}

.mode-plein-ecran .welcome {
  min-height: 100%;
  justify-content: center;
  padding-top: 25px;
  padding-bottom: 25px;
}

.mode-plein-ecran .composer-area {
  flex-shrink: 0;
}

.mode-plein-ecran .robot-area {
  width: 255px;
  height: 210px;
}

.mode-plein-ecran .robot-image {
  width: 255px;
  height: 210px;
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .chat-page {
    padding: 20px 16px;
  }

  .hero-copy {
    width: 78%;
  }

  .hero-photo {
    left: 45%;
  }
}

@media (max-width: 700px) {
  .page-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-banner {
    min-height: 190px;
  }

  .hero-copy {
    width: 100%;
    padding: 24px;
  }

  .hero-photo {
    opacity: .2;
    left: 0;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .welcome {
    padding: 20px 16px;
  }

  .robot-area {
    width: 190px;
    height: 160px;
  }

  .robot-image {
    width: 190px;
    height: 160px;
  }

  .panel-topbar {
    padding: 12px;
  }

  .demo-status {
    font-size: 9px;
  }

  .composer-area {
    padding: 12px;
  }

  .mode-plein-ecran .chat-history {
    position: absolute;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    width: 260px;
    box-shadow: 10px 0 30px rgba(0,0,0,.08);
  }

  .mode-plein-ecran .chat-history-hidden {
    width: 0 !important;
  }

  .mode-plein-ecran .history-content {
    width: 260px;
  }

  .fullscreen-label {
    display: none;
  }
}
</style>
