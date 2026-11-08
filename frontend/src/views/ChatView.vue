
<script setup>
import { ref, computed, nextTick, watch } from 'vue'

// 1. Messages de bienvenue
const messageBienvenue = {
  id: 1,
  role: 'assistant',
  contenu: 'Bonjour ! 👋 Je suis COSIDER AI, votre assistant documentaire. Je peux vous aider à comprendre les rapports, les procédures de sécurité et les documents techniques. Comment puis-je vous aider ?',
  heure: ''
}

// 2. Charger les messages sauvegardés
function chargerMessages() {
  try {
    const sauvegarde = JSON.parse(localStorage.getItem('cosider-chat'))
    return Array.isArray(sauvegarde) && sauvegarde.length
      ? sauvegarde
      : [{ ...messageBienvenue }]
  } catch {
    return [{ ...messageBienvenue }]
  }
}

const messages = ref(chargerMessages())
const nouveauMessage = ref('')
const chargement = ref(false)
const zoneMessages = ref(null)

// 3. Questions suggérées
const suggestions = [
  'Quelles sont les règles de sécurité sur un chantier ?',
  'Comment organiser un rapport technique ?',
  'Quels sont les équipements de protection individuelle ?',
  'Comment préparer une réunion de chantier ?'
]

// 4. Nombre de messages envoyés
const nombreQuestions = computed(() =>
  messages.value.filter(m => m.role === 'user').length
)

// 5. Sauvegarder automatiquement la conversation
watch(messages, (valeur) => {
  try {
    localStorage.setItem('cosider-chat', JSON.stringify(valeur))
  } catch (erreur) {
    console.error('Sauvegarde impossible :', erreur)
  }
}, { deep: true })

// 6. Afficher le dernier message
async function defilerVersBas() {
  await nextTick()
  if (zoneMessages.value) {
    zoneMessages.value.scrollTop = zoneMessages.value.scrollHeight
  }
}

// 7. Réponses de démonstration
function genererReponse(question) {
  const texte = question.toLowerCase()

  if (texte.includes('sécurité') || texte.includes('chantier')) {
    return `La sécurité sur un chantier repose sur plusieurs principes :

• Porter les équipements de protection individuelle (EPI).
• Respecter les consignes et les zones de circulation.
• Vérifier les équipements avant leur utilisation.
• Signaler immédiatement les situations dangereuses.
• Participer aux formations de prévention.

Cette réponse est une démonstration générale, et non une analyse des documents COSIDER.`
  }

  if (texte.includes('rapport')) {
    return `Un rapport technique peut contenir :

1. Une page de garde.
2. Une introduction présentant le contexte.
3. Les objectifs du projet.
4. La méthodologie utilisée.
5. Les résultats obtenus.
6. Une conclusion et des recommandations.

Vous pourrez prochainement importer un rapport et demander son résumé automatique.`
  }

  if (texte.includes('équipement') || texte.includes('protection')) {
    return `Les équipements de protection individuelle courants comprennent :

• Le casque de sécurité.
• Les chaussures de sécurité.
• Les gants adaptés aux travaux.
• Les lunettes de protection.
• Le gilet haute visibilité.
• Les protections auditives lorsque nécessaire.

Le choix exact des EPI dépend des risques identifiés pour chaque activité.`
  }

  if (texte.includes('réunion')) {
    return `Pour préparer une réunion de chantier :

1. Définir l'ordre du jour.
2. Vérifier l'avancement des travaux.
3. Identifier les difficultés rencontrées.
4. Préparer les documents nécessaires.
5. Définir les décisions et les responsables.
6. Rédiger un compte rendu après la réunion.`
  }

  if (texte.includes('bonjour') || texte.includes('salut')) {
    return 'Bonjour ! 😊 Bienvenue sur COSIDER AI. Vous pouvez me poser une question sur les documents, la sécurité ou les rapports techniques.'
  }

  return `Votre question : "${question}"

Je suis actuellement en mode démonstration.

Je peux afficher des réponses prédéfinies concernant :
• La sécurité sur les chantiers.
• Les rapports techniques.
• Les équipements de protection.
• Les réunions de chantier.

La connexion à une véritable intelligence artificielle sera ajoutée dans une prochaine étape.`
}

// 8. Envoyer un message
function envoyerMessage(texteSuggestion = null) {
  if (chargement.value) return

  const texte = typeof texteSuggestion === 'string'
    ? texteSuggestion.trim()
    : nouveauMessage.value.trim()

  if (!texte) return

  messages.value.push({
    id: Date.now() + Math.random(),
    role: 'user',
    contenu: texte,
    heure: new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  })

  nouveauMessage.value = ''
  chargement.value = true
  defilerVersBas()

  // Simuler un délai de réponse
  setTimeout(() => {
    messages.value.push({
      id: Date.now() + Math.random(),
      role: 'assistant',
      contenu: genererReponse(texte),
      heure: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    })

    chargement.value = false
    defilerVersBas()
  }, 700)
}

// 9. Nouvelle conversation
function nouvelleConversation() {
  if (chargement.value) return

  if (confirm('Effacer la conversation actuelle ?')) {
    messages.value = [{ ...messageBienvenue }]
    nouveauMessage.value = ''
  }
}

// 10. Envoyer avec la touche Entrée
function gererClavier(event) {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault()
    envoyerMessage()
  }
}
</script>

<template>
  <div class="chat-page">

    <!-- EN-TÊTE -->
    <div class="chat-header">
      <div class="assistant-info">
        <div class="assistant-avatar">✦</div>

        <div>
          <h2>Assistant COSIDER AI</h2>
          <p>
            <span class="status-dot"></span>
            Mode démonstration
          </p>
        </div>
      </div>

      <button class="new-chat-btn" @click="nouvelleConversation">
        + Nouvelle conversation
      </button>
    </div>

    <!-- ZONE PRINCIPALE -->
    <div class="chat-container">

      <!-- INFORMATIONS -->
      <div class="chat-toolbar">
        <span>💬 Conversation documentaire</span>
        <span>{{ nombreQuestions }} question(s)</span>
      </div>

      <!-- MESSAGES -->
      <div ref="zoneMessages" class="messages-area">

        <div
          v-for="message in messages"
          :key="message.id"
          class="message-row"
          :class="message.role"
        >
          <div class="message-avatar">
            {{ message.role === 'assistant' ? '✦' : 'U' }}
          </div>

          <div class="message-content">
            <span class="message-author">
              {{ message.role === 'assistant' ? 'COSIDER AI' : 'Vous' }}
            </span>

            <div class="message-bubble">
              {{ message.contenu }}
            </div>

            <small v-if="message.heure">{{ message.heure }}</small>
          </div>
        </div>

        <!-- INDICATEUR DE CHARGEMENT -->
        <div v-if="chargement" class="message-row assistant">
          <div class="message-avatar">✦</div>
          <div class="message-content">
            <span class="message-author">COSIDER AI</span>
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- QUESTIONS SUGGÉRÉES -->
        <div v-if="nombreQuestions === 0" class="suggestions">
          <h3>Questions suggérées</h3>

          <div class="suggestions-grid">
            <button
              v-for="suggestion in suggestions"
              :key="suggestion"
              @click="envoyerMessage(suggestion)"
            >
              <span>✦</span>
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>

      <!-- SAISIE DU MESSAGE -->
      <div class="input-section">
        <div class="input-wrapper">
          <textarea
            v-model="nouveauMessage"
            placeholder="Posez votre question à COSIDER AI..."
            rows="2"
            :disabled="chargement"
            @keydown="gererClavier"
          ></textarea>

          <button
            class="send-btn"
            :disabled="!nouveauMessage.trim() || chargement"
            @click="envoyerMessage()"
          >
            ➤
          </button>
        </div>

        <p class="input-note">
          Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne
        </p>
        <p class="demo-warning">
          Réponses simulées : aucun document n'est encore consulté par l'IA.
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: calc(100vh - 145px);
  min-height: 540px;
  color: #263441;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.assistant-info {
  display: flex;
  align-items: center;
  gap: 13px;
}

.assistant-avatar {
  width: 46px;
  height: 46px;
  background: linear-gradient(135deg, #b76b43, #dfaa84);
  color: white;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 25px;
}

.assistant-info h2 {
  font-size: 21px;
  font-weight: 700;
}

.assistant-info p {
  font-size: 12px;
  color: #7b8993;
  margin-top: 4px;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #4bae7c;
  border-radius: 50%;
  margin-right: 5px;
}

.new-chat-btn {
  border: 1px solid #e2e5e8;
  background: white;
  padding: 10px 15px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.new-chat-btn:hover {
  background: #f8f2ed;
}

.chat-container {
  background: white;
  border: 1px solid #e7e9ec;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.chat-toolbar {
  padding: 16px 22px;
  border-bottom: 1px solid #eef0f2;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: #7c8993;
}

.messages-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 23px;
}

.message-row {
  display: flex;
  gap: 12px;
  max-width: 85%;
}

.message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #f5e8df;
  color: #b76b43;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.user .message-avatar {
  background: #e6edf5;
  color: #4d7197;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.user .message-content {
  align-items: flex-end;
}

.message-author {
  font-size: 12px;
  font-weight: 700;
  color: #5d6973;
}

.message-bubble {
  background: #f6f7f9;
  border: 1px solid #eef0f2;
  padding: 13px 17px;
  border-radius: 4px 15px 15px 15px;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.user .message-bubble {
  background: #b76b43;
  color: white;
  border-color: #b76b43;
  border-radius: 15px 4px 15px 15px;
}

.message-content small {
  color: #a1aab2;
  font-size: 10px;
}

.suggestions {
  margin-top: 15px;
  padding-top: 15px;
}

.suggestions h3 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 15px;
}

.suggestions-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.suggestions-grid button {
  border: 1px solid #e9e2dc;
  background: #fdfaf8;
  padding: 15px;
  border-radius: 11px;
  text-align: left;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.suggestions-grid button span {
  color: #b76b43;
  margin-right: 7px;
}

.suggestions-grid button:hover {
  border-color: #b76b43;
  background: #f9eee6;
}

.input-section {
  border-top: 1px solid #edf0f2;
  padding: 16px 22px;
}

.input-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  border: 1px solid #dce2e7;
  border-radius: 13px;
  padding: 9px;
}

.input-wrapper:focus-within {
  border-color: #b76b43;
}

textarea {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: 8px;
  font-size: 14px;
  background: transparent;
  min-height: 55px;
}

.send-btn {
  background: #b76b43;
  color: white;
  border: none;
  border-radius: 9px;
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  font-size: 19px;
  cursor: pointer;
}

.send-btn:hover {
  background: #975331;
}

.send-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.input-note,
.demo-warning {
  text-align: center;
  font-size: 11px;
  margin-top: 9px;
  color: #9aa5ae;
}

.demo-warning {
  color: #b76b43;
}

.typing-indicator {
  display: flex;
  gap: 5px;
  padding: 16px;
  background: #f6f7f9;
  border-radius: 12px;
}

.typing-indicator span {
  width: 7px;
  height: 7px;
  background: #b76b43;
  border-radius: 50%;
  animation: pulse 1s infinite alternate;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  from { opacity: 0.25; transform: translateY(0); }
  to { opacity: 1; transform: translateY(-4px); }
}

@media (max-width: 650px) {
  .chat-page {
    height: calc(100dvh - 115px);
    min-height: 430px;
  }

  .chat-header {
    align-items: flex-start;
  }

  .messages-area {
    padding: 15px;
  }

  .message-row {
    max-width: 96%;
  }

  .suggestions-grid {
    grid-template-columns: 1fr;
  }

  .input-section {
    padding: 12px;
  }
}
</style>
