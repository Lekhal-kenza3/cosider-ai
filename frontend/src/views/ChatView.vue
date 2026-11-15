
<script setup>
import { ref, nextTick } from 'vue'

const messages = ref([])
const saisie = ref('')
const zoneMessages = ref(null)
const conversationCommencee = ref(false)

const suggestions = [
  {
    icone: '▤',
    titre: 'Résumer un document',
    description: 'Obtenir les informations essentielles',
    question: 'Peux-tu résumer les points importants de ce document ?'
  },
  {
    icone: '✦',
    titre: 'Analyser un rapport',
    description: 'Explorer les données et conclusions',
    question: 'Quels sont les principaux résultats de ce rapport ?'
  },
  {
    icone: '◈',
    titre: 'Rechercher une information',
    description: 'Poser une question sur un fichier',
    question: 'Quelles informations importantes contient ce fichier ?'
  },
  {
    icone: '✓',
    titre: 'Vérifier une procédure',
    description: 'Examiner les étapes d’un processus',
    question: 'Quelles sont les étapes principales de cette procédure ?'
  }
]

function utiliserSuggestion(question) {
  saisie.value = question
}

async function envoyerMessage() {
  const texte = saisie.value.trim()
  if (!texte) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    contenu: texte,
    heure: new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  conversationCommencee.value = true
  saisie.value = ''

  await nextTick()
  defilerEnBas()
}

function defilerEnBas() {
  if (zoneMessages.value) {
    zoneMessages.value.scrollTop = zoneMessages.value.scrollHeight
  }
}

function nouvelleConversation() {
  messages.value = []
  saisie.value = ''
  conversationCommencee.value = false
}
</script>

<template>
  <div class="chat-page cosider-fade-in">

    <!-- EN-TÊTE -->
    <div class="page-heading">
      <div>
        <span class="eyebrow">COSIDER AI · ASSISTANT INTELLIGENT</span>
        <h1>Assistant <span>documentaire.</span></h1>
        <p>
          Un espace de conversation conçu pour interagir
          avec vos documents et explorer leurs informations.
        </p>
      </div>

      <button class="new-chat-btn" @click="nouvelleConversation">
        <span>＋</span>
        Nouvelle conversation
      </button>
    </div>

    <!-- ESPACE DE CONVERSATION -->
    <div class="chat-container">

      <!-- BARRE SUPÉRIEURE -->
      <div class="chat-topbar">
        <div class="assistant-identity">
          <div class="assistant-avatar">✦</div>

          <div>
            <strong>COSIDER AI Assistant</strong>
            <span>Interface de conversation</span>
          </div>
        </div>

        <div class="model-badge">
          <span class="model-dot"></span>
          Mode démonstration
        </div>
      </div>

      <!-- MESSAGES -->
      <div ref="zoneMessages" class="chat-messages">

        <!-- ÉCRAN D'ACCUEIL -->
        <div v-if="!conversationCommencee" class="welcome-screen">
          <div class="welcome-symbol">
            <div class="symbol-inner">✦</div>
          </div>

          <div class="welcome-label">
            VOTRE ESPACE D'INTELLIGENCE DOCUMENTAIRE
          </div>

          <h2>
            Bonjour, comment puis-je<br />
            <span>vous accompagner ?</span>
          </h2>

          <p>
            Préparez vos questions et découvrez les possibilités
            de votre futur assistant documentaire COSIDER AI.
          </p>

          <div class="suggestions-grid">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion.titre"
              class="suggestion-card"
              @click="utiliserSuggestion(suggestion.question)"
            >
              <span class="suggestion-icon">{{ suggestion.icone }}</span>

              <strong>{{ suggestion.titre }}</strong>
              <small>{{ suggestion.description }}</small>

              <span class="suggestion-arrow">↗</span>
            </button>
          </div>
        </div>

        <!-- CONVERSATION -->
        <div v-else class="conversation">
          <div class="conversation-date">Conversation actuelle</div>

          <div
            v-for="message in messages"
            :key="message.id"
            class="message-row user-row"
          >
            <div class="message-avatar user-avatar">U</div>

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
            <div class="demo-notice-icon">✦</div>
            <div>
              <strong>Assistant IA en préparation</strong>
              <p>
                Vos messages s'affichent correctement.
                Les réponses automatiques seront disponibles
                lorsque nous connecterons le backend IA.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- SAISIE -->
      <div class="composer-area">
        <div class="composer">
          <textarea
            v-model="saisie"
            placeholder="Posez votre question sur vos documents..."
            rows="2"
            @keydown.enter.exact.prevent="envoyerMessage"
          ></textarea>

          <div class="composer-bottom">
            <div class="composer-tools">
              <span class="composer-hint">
                ✦ Espace de travail intelligent
              </span>
            </div>

            <button
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
              >
                <path d="m5 12 14-7-4 14-3-6-7-1Z"/>
                <path d="m12 13 7-8"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="composer-footer">
          <span>
            COSIDER AI · Intelligence documentaire
          </span>
          <span>
            Interface de démonstration — aucune réponse IA générée
          </span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: calc(100vh - 160px);
  color: #202634;
}

.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.eyebrow {
  color: #b51226;
  font-size: 10px;
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

.page-heading p {
  color: #9099a7;
  font-size: 12px;
  line-height: 1.8;
  margin: 0;
}

.new-chat-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  background: #b51226;
  color: white;
  border: none;
  border-radius: 11px;
  padding: 13px 17px;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 7px 18px rgba(181,18,38,.15);
}

.new-chat-btn:hover {
  background: #981023;
  transform: translateY(-2px);
}

.new-chat-btn span {
  font-size: 19px;
  font-weight: 400;
}

.chat-container {
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 20px;
  box-shadow: 0 10px 35px rgba(30,35,50,.035);
  display: flex;
  flex-direction: column;
  min-height: 660px;
  height: calc(100vh - 250px);
  max-height: 1000px;
  overflow: hidden;
}

.chat-topbar {
  min-height: 77px;
  border-bottom: 1px solid #eef0f3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  gap: 15px;
}

.assistant-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.assistant-avatar {
  width: 43px;
  height: 43px;
  border-radius: 13px;
  background: linear-gradient(145deg, #d61b34, #9d0d21);
  display: grid;
  place-items: center;
  color: white;
  font-size: 23px;
  box-shadow: 0 6px 15px rgba(181,18,38,.14);
}

.assistant-identity > div:last-child {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.assistant-identity strong {
  font-size: 13px;
}

.assistant-identity span {
  color: #929baa;
  font-size: 10px;
}

.model-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff5e9;
  color: #ad741d;
  border: 1px solid #f8e7cc;
  border-radius: 30px;
  padding: 8px 12px;
  font-size: 10px;
  font-weight: 700;
}

.model-dot {
  width: 7px;
  height: 7px;
  background: #dfa337;
  border-radius: 50%;
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 25px;
  background:
    radial-gradient(circle at 50% 10%, #fff7f8 0, transparent 50%),
    #ffffff;
}

.welcome-screen {
  max-width: 750px;
  margin: 0 auto;
  padding: 36px 10px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.welcome-symbol {
  width: 93px;
  height: 93px;
  border-radius: 27px;
  background: #fff0f2;
  display: grid;
  place-items: center;
  margin-bottom: 25px;
  border: 1px solid #f8d8de;
  box-shadow: 0 0 0 13px rgba(255,240,242,.5);
}

.symbol-inner {
  width: 62px;
  height: 62px;
  border-radius: 19px;
  background: linear-gradient(145deg, #d71d37, #a20d21);
  color: white;
  display: grid;
  place-items: center;
  font-size: 34px;
}

.welcome-label {
  color: #b51226;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 13px;
}

.welcome-screen h2 {
  font-size: clamp(25px, 3vw, 35px);
  line-height: 1.35;
  margin: 0;
  font-weight: 800;
}

.welcome-screen h2 span {
  color: #b51226;
}

.welcome-screen > p {
  max-width: 460px;
  color: #929baa;
  font-size: 12px;
  line-height: 1.9;
  margin: 15px 0 29px;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
  width: 100%;
}

.suggestion-card {
  position: relative;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 20px;
  border: 1px solid #eceef2;
  border-radius: 14px;
  background: white;
  transition: all .2s;
}

.suggestion-card:hover {
  border-color: #edb5bf;
  background: #fffafb;
  transform: translateY(-2px);
  box-shadow: 0 9px 24px rgba(181,18,38,.06);
}

.suggestion-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #fff0f2;
  color: #b51226;
  display: grid;
  place-items: center;
  font-size: 19px;
  margin-bottom: 4px;
}

.suggestion-card strong {
  font-size: 12px;
  color: #2b3442;
}

.suggestion-card small {
  font-size: 10px;
  color: #9ba3af;
}

.suggestion-arrow {
  position: absolute;
  top: 20px;
  right: 18px;
  color: #c7cbd3;
  font-size: 17px;
}

.suggestion-card:hover .suggestion-arrow {
  color: #b51226;
}

.conversation {
  max-width: 850px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.conversation-date {
  text-align: center;
  color: #a3aab5;
  font-size: 10px;
  margin: 12px 0;
}

.message-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.user-row {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 800;
}

.user-avatar {
  background: #fff0f2;
  color: #b51226;
}

.message-content {
  max-width: 75%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
}

.message-header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.message-header strong {
  font-size: 11px;
}

.message-header span {
  font-size: 10px;
  color: #a0a7b2;
}

.message-bubble {
  background: #b51226;
  color: white;
  border-radius: 15px 4px 15px 15px;
  padding: 13px 17px;
  font-size: 12px;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.demo-notice {
  display: flex;
  gap: 13px;
  align-items: flex-start;
  padding: 18px;
  border: 1px solid #f1e0e3;
  border-radius: 13px;
  background: #fff9fa;
}

.demo-notice-icon {
  width: 37px;
  height: 37px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #fff0f2;
  color: #b51226;
  display: grid;
  place-items: center;
  font-size: 22px;
}

.demo-notice strong {
  font-size: 12px;
}

.demo-notice p {
  color: #8992a0;
  font-size: 11px;
  line-height: 1.8;
  margin: 7px 0 0;
}

.composer-area {
  border-top: 1px solid #eef0f3;
  padding: 19px 25px 15px;
  background: white;
}

.composer {
  max-width: 850px;
  margin: 0 auto;
  border: 1px solid #e5e8ee;
  border-radius: 15px;
  padding: 14px 16px 12px;
  transition: border-color .2s, box-shadow .2s;
}

.composer:focus-within {
  border-color: #d65c6e;
  box-shadow: 0 0 0 4px rgba(181,18,38,.05);
}

.composer textarea {
  width: 100%;
  min-height: 53px;
  max-height: 150px;
  resize: vertical;
  border: none;
  outline: none;
  font-size: 12px;
  color: #283140;
  line-height: 1.7;
  background: transparent;
}

.composer textarea::placeholder {
  color: #a1a9b5;
}

.composer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.composer-hint {
  color: #a2a9b5;
  font-size: 10px;
}

.send-button {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 11px;
  background: #b51226;
  color: white;
  display: grid;
  place-items: center;
}

.send-button:hover:not(:disabled) {
  background: #961023;
  transform: translateY(-2px);
}

.send-button:disabled {
  background: #e5c8cd;
  cursor: not-allowed;
}

.send-button svg {
  width: 18px;
  height: 18px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.composer-footer {
  max-width: 850px;
  margin: 12px auto 0;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: #a4abb6;
  font-size: 10px;
}

@media (max-width: 768px) {
  .chat-container {
    height: calc(100vh - 230px);
    min-height: 550px;
  }

  .chat-topbar,
  .chat-messages,
  .composer-area {
    padding-left: 15px;
    padding-right: 15px;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .welcome-screen {
    padding-top: 20px;
  }

  .model-badge,
  .composer-footer span:last-child {
    display: none;
  }

  .message-content {
    max-width: 85%;
  }
}
</style>
