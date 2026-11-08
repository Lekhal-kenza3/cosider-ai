
<script setup>
import { ref, computed, onMounted } from 'vue'

// 1. Variables réactives
const conversations = ref([])
const recherche = ref('')
const conversationSelectionnee = ref(null)

// 2. Charger les conversations depuis localStorage
function chargerHistorique() {
  try {
    const sauvegarde = localStorage.getItem('cosider-chat')

    if (!sauvegarde) {
      conversations.value = []
      conversationSelectionnee.value = null
      return
    }

    const messages = JSON.parse(sauvegarde)

    if (!Array.isArray(messages)) return

    const questions = messages.filter(
      message => message.role === 'user'
    )

    // Ne pas afficher une conversation vide
    if (questions.length === 0) {
      conversations.value = []
      conversationSelectionnee.value = null
      return
    }

    conversations.value = [
      {
        id: 1,
        titre: questions[0].contenu,
        date: 'Conversation enregistrée',
        messages: messages,
        nombreQuestions: questions.length
      }
    ]

  } catch (erreur) {
    console.error('Erreur de chargement :', erreur)
    conversations.value = []
    conversationSelectionnee.value = null
  }
}

// 3. Recherche dynamique
const conversationsFiltrees = computed(() => {
  const mot = recherche.value.toLowerCase().trim()

  return conversations.value.filter(conv => {
    return (
      conv.titre.toLowerCase().includes(mot) ||
      conv.messages.some(message =>
        String(message.contenu || '')
          .toLowerCase()
          .includes(mot)
      )
    )
  })
})

// 4. Statistiques
const totalConversations = computed(() =>
  conversations.value.length
)

const totalQuestions = computed(() =>
  conversations.value.reduce(
    (total, conv) => total + conv.nombreQuestions,
    0
  )
)

const totalMessages = computed(() =>
  conversations.value.reduce(
    (total, conv) => total + conv.messages.length,
    0
  )
)

// 5. Ouvrir une conversation
function ouvrirConversation(conv) {
  conversationSelectionnee.value = conv
}

// 6. Fermer les détails
function fermerConversation() {
  conversationSelectionnee.value = null
}

// 7. Supprimer une conversation
function supprimerConversation(id) {
  if (!confirm('Voulez-vous supprimer cette conversation ?')) {
    return
  }

  conversations.value = conversations.value.filter(
    conv => conv.id !== id
  )

  localStorage.removeItem('cosider-chat')
  conversationSelectionnee.value = null
}

// 8. Supprimer tout l'historique
function effacerHistorique() {
  if (conversations.value.length === 0) return

  if (!confirm('Voulez-vous effacer tout l’historique ?')) {
    return
  }

  localStorage.removeItem('cosider-chat')
  conversations.value = []
  conversationSelectionnee.value = null
}

// 9. Charger au démarrage
onMounted(() => {
  chargerHistorique()
})
</script>

<template>
  <div class="history-page">

    <!-- EN-TÊTE -->
    <div class="page-header">
      <div>
        <h2>Historique des conversations</h2>
        <p>
          Retrouvez et consultez vos échanges avec COSIDER AI.
        </p>
      </div>

      <button
        class="delete-all-btn"
        :disabled="conversations.length === 0"
        @click="effacerHistorique"
      >
        🗑 Effacer l'historique
      </button>
    </div>

    <!-- STATISTIQUES -->
    <div class="stats-grid">

      <div class="stat-card">
        <span>Conversations</span>
        <strong>{{ totalConversations }}</strong>
        <small>Discussions enregistrées</small>
      </div>

      <div class="stat-card">
        <span>Questions posées</span>
        <strong>{{ totalQuestions }}</strong>
        <small>Messages envoyés à l'assistant</small>
      </div>

      <div class="stat-card">
        <span>Messages échangés</span>
        <strong>{{ totalMessages }}</strong>
        <small>Utilisateur et assistant</small>
      </div>

    </div>

    <!-- CONTENU -->
    <div class="history-layout">

      <!-- LISTE DES CONVERSATIONS -->
      <section class="history-card">
        <div class="section-header">
          <h3>Mes conversations</h3>
          <span class="count-badge">
            {{ conversationsFiltrees.length }}
          </span>
        </div>

        <input
          v-model="recherche"
          type="search"
          class="search-input"
          placeholder="Rechercher une conversation..."
        />

        <div class="conversation-list">

          <div
            v-for="conv in conversationsFiltrees"
            :key="conv.id"
            class="conversation-item"
            :class="{
              active: conversationSelectionnee?.id === conv.id
            }"
          >
            <button
              class="conversation-main"
              @click="ouvrirConversation(conv)"
            >
              <span class="conversation-icon">💬</span>

              <span class="conversation-info">
                <strong>{{ conv.titre }}</strong>
                <small>{{ conv.date }}</small>
                <small>{{ conv.nombreQuestions }} question(s)</small>
              </span>
            </button>

            <button
              class="delete-item-btn"
              title="Supprimer"
              @click="supprimerConversation(conv.id)"
            >
              ✕
            </button>
          </div>

          <div
            v-if="conversationsFiltrees.length === 0"
            class="empty-list"
          >
            <div class="empty-icon">💬</div>
            <h4>Aucune conversation trouvée</h4>
            <p>
              Discutez avec l'Assistant IA pour créer un historique.
            </p>
          </div>

        </div>
      </section>

      <!-- DÉTAILS DE LA CONVERSATION -->
      <section class="details-card">

        <template v-if="conversationSelectionnee">
          <div class="details-header">
            <div>
              <h3>Conversation</h3>
              <p>{{ conversationSelectionnee.nombreQuestions }} question(s)</p>
            </div>

            <button
              class="close-btn"
              @click="fermerConversation"
            >
              ✕
            </button>
          </div>

          <div class="details-messages">
            <div
              v-for="message in conversationSelectionnee.messages"
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

                <small v-if="message.heure">
                  {{ message.heure }}
                </small>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="empty-details">
          <div class="details-placeholder">▤</div>
          <h3>Sélectionnez une conversation</h3>
          <p>
            Cliquez sur une conversation à gauche pour
            afficher les messages échangés.
          </p>
        </div>

      </section>
    </div>

    <p class="demo-note">
      Historique enregistré localement dans ce navigateur.
      Aucune donnée n'est envoyée à un serveur.
    </p>

  </div>
</template>

<style scoped>
.history-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
  color: #273441;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
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

.delete-all-btn {
  padding: 11px 16px;
  border: 1px solid #f0d4d4;
  background: #fff4f4;
  color: #bd5555;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.delete-all-btn:disabled {
  opacity: .45;
  cursor: not-allowed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.stat-card,
.history-card,
.details-card {
  background: white;
  border: 1px solid #e6e9ed;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(20, 30, 40, .025);
}

.stat-card {
  padding: 22px;
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

.history-layout {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(0, 1.7fr);
  gap: 20px;
  min-height: 490px;
}

.history-card {
  padding: 20px;
  min-width: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.section-header h3,
.details-header h3 {
  font-size: 17px;
  font-weight: 700;
}

.count-badge {
  background: #f7e9df;
  color: #b76b43;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 700;
}

.search-input {
  width: 100%;
  border: 1px solid #dce2e7;
  border-radius: 9px;
  padding: 12px;
  outline: none;
  font-size: 13px;
  margin-bottom: 20px;
}

.search-input:focus {
  border-color: #b76b43;
}

.conversation-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #edf0f2;
  border-radius: 11px;
  padding: 10px;
  transition: .2s;
}

.conversation-item:hover,
.conversation-item.active {
  border-color: #d8b69e;
  background: #fdf8f4;
}

.conversation-main {
  display: flex;
  align-items: center;
  text-align: left;
  gap: 12px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.conversation-icon {
  background: #f7e9df;
  border-radius: 10px;
  padding: 11px;
  font-size: 18px;
}

.conversation-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.conversation-info strong {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-info small {
  color: #919ca5;
  font-size: 11px;
}

.delete-item-btn {
  color: #c15d5d;
  padding: 8px;
  cursor: pointer;
}

.details-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #edf0f2;
}

.details-header p {
  color: #919ca5;
  font-size: 12px;
  margin-top: 5px;
}

.close-btn {
  cursor: pointer;
  color: #7c8993;
}

.details-messages {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  max-height: 540px;
}

.message-row {
  display: flex;
  gap: 10px;
  max-width: 90%;
}

.message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 9px;
  background: #f7e9df;
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
  font-size: 11px;
  font-weight: 700;
}

.message-bubble {
  padding: 12px 15px;
  background: #f6f7f9;
  border-radius: 4px 13px 13px 13px;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.user .message-bubble {
  background: #b76b43;
  color: white;
  border-radius: 13px 4px 13px 13px;
}

.message-content small {
  font-size: 10px;
  color: #a1aab2;
}

.empty-list,
.empty-details {
  text-align: center;
  padding: 50px 20px;
  color: #87939e;
}

.empty-list h4,
.empty-details h3 {
  color: #273441;
  font-weight: 700;
  margin-top: 12px;
}

.empty-list p,
.empty-details p {
  font-size: 12px;
  margin-top: 9px;
  line-height: 1.7;
}

.empty-icon,
.details-placeholder {
  font-size: 35px;
  color: #b76b43;
}

.empty-details {
  margin: auto;
  max-width: 350px;
}

.demo-note {
  font-size: 12px;
  color: #9aa4ad;
  text-align: center;
}

@media (max-width: 850px) {
  .history-layout {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
