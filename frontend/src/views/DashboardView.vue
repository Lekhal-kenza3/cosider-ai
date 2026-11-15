
<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

const dateActuelle = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const periode = ref('7 jours')

// Données de démonstration en attendant la connexion aux API.
const statistiques = ref([
  {
    titre: 'Documents enregistrés',
    valeur: '1 284',
    evolution: '+12,8 %',
    symbole: '▤',
    couleur: 'red'
  },
  {
    titre: 'Documents analysés',
    valeur: '986',
    evolution: '+8,2 %',
    symbole: '✦',
    couleur: 'purple'
  },
  {
    titre: 'Questions traitées',
    valeur: '3 642',
    evolution: '+18,4 %',
    symbole: '◈',
    couleur: 'blue'
  },
  {
    titre: 'Taux de traitement',
    valeur: '94,6 %',
    evolution: '+4,1 %',
    symbole: '◉',
    couleur: 'green'
  }
])

const activites = ref([
  {
    nom: 'Rapport technique chantier.pdf',
    detail: 'Analyse documentaire terminée',
    date: 'Aujourd’hui · 09:42',
    type: 'Analyse',
    icone: '✦'
  },
  {
    nom: 'Procédures de sécurité.pdf',
    detail: 'Document ajouté à la bibliothèque',
    date: 'Aujourd’hui · 08:35',
    type: 'Document',
    icone: '▤'
  },
  {
    nom: 'Assistant documentaire',
    detail: 'Nouvelle conversation enregistrée',
    date: 'Hier · 16:20',
    type: 'Assistant',
    icone: '◈'
  }
])

const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const donneesGraphique = computed(() => {
  return periode.value === '7 jours'
    ? [42, 68, 54, 83, 62, 92, 75]
    : [55, 72, 64, 87, 69, 95, 82]
})

const valeurMax = computed(() => Math.max(...donneesGraphique.value))
</script>

<template>
  <div class="dashboard cosider-fade-in">

    <!-- EN-TÊTE -->
    <div class="dashboard-heading">
      <div>
        <div class="eyebrow">
          <span class="eyebrow-line"></span>
          CENTRE DE PILOTAGE INTELLIGENT
        </div>

        <h1>Vue d'ensemble <span>COSIDER AI.</span></h1>

        <p>
          Pilotez vos documents, vos analyses et vos activités
          depuis un espace de travail intelligent.
        </p>
      </div>

      <div class="date-chip">
        <span>◷</span>
        {{ dateActuelle }}
      </div>
    </div>

    <!-- BANNIÈRE PRINCIPALE -->
    <section class="hero">
      <div class="hero-decoration hero-decoration-one"></div>
      <div class="hero-decoration hero-decoration-two"></div>

      <div class="hero-content">
        <div class="hero-label">
          <span class="hero-sparkle">✦</span>
          INTELLIGENCE DOCUMENTAIRE
        </div>

        <h2>
          Vos documents.<br />
          <span>Une nouvelle intelligence.</span>
        </h2>

        <p>
          Centralisez vos fichiers, simplifiez leur analyse
          et explorez leurs informations avec COSIDER AI.
        </p>

        <div class="hero-actions">
          <RouterLink to="/documents" class="hero-primary">
            Importer un document
            <span>↗</span>
          </RouterLink>

          <RouterLink to="/chat" class="hero-secondary">
            Découvrir l'assistant IA
            <span>→</span>
          </RouterLink>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <div class="orbit orbit-one"></div>
        <div class="orbit orbit-two"></div>
        <div class="orbit orbit-three"></div>

        <div class="ai-core">
          <span>✦</span>
          <strong>AI</strong>
        </div>

        <div class="floating-card floating-card-top">
          <span>▤</span>
          <div>
            <strong>Document</strong>
            <small>Analyse intelligente</small>
          </div>
        </div>

        <div class="floating-card floating-card-bottom">
          <span>✓</span>
          <div>
            <strong>Information</strong>
            <small>Prête à explorer</small>
          </div>
        </div>
      </div>
    </section>

    <!-- STATISTIQUES -->
    <div class="section-title">
      <div>
        <h2>Indicateurs clés</h2>
        <p>Exemple de suivi des performances documentaires</p>
      </div>

      <span class="demo-label">Données de démonstration</span>
    </div>

    <div class="stats-grid">
      <div
        v-for="stat in statistiques"
        :key="stat.titre"
        class="stat-card"
      >
        <div class="stat-top">
          <div class="stat-icon" :class="stat.couleur">
            {{ stat.symbole }}
          </div>
          <span class="stat-trend">{{ stat.evolution }}</span>
        </div>

        <div class="stat-value">{{ stat.valeur }}</div>
        <div class="stat-name">{{ stat.titre }}</div>

        <div class="stat-footer">
          <span class="mini-dot"></span>
          Données illustratives
        </div>
      </div>
    </div>

    <!-- GRAPHIQUE ET ASSISTANT -->
    <div class="content-grid">

      <section class="panel chart-panel">
        <div class="panel-heading">
          <div>
            <span class="section-kicker">ANALYTICS</span>
            <h3>Activité documentaire</h3>
            <p>Visualisation illustrative de l'activité</p>
          </div>

          <select v-model="periode" class="period-select">
            <option>7 jours</option>
            <option>30 jours</option>
          </select>
        </div>

        <div class="chart">
          <div class="chart-lines">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div class="chart-bars">
            <div
              v-for="(valeur, index) in donneesGraphique"
              :key="index"
              class="bar-column"
            >
              <div class="bar-track">
                <div
                  class="bar-fill"
                  :style="{ height: (valeur / valeurMax * 100) + '%' }"
                ></div>
              </div>
              <small>{{ jours[index] }}</small>
            </div>
          </div>
        </div>

        <div class="chart-footer">
          <span class="legend-dot"></span>
          Documents traités — données fictives
        </div>
      </section>

      <section class="panel assistant-panel">
        <div class="assistant-header">
          <div class="assistant-icon">✦</div>
          <span>ESPACE INTELLIGENT</span>
        </div>

        <h3>Votre assistant<br /><span>documentaire IA.</span></h3>

        <p>
          Accédez à votre espace de conversation pour préparer
          vos futures recherches et analyses documentaires.
        </p>

        <div class="assistant-suggestions">
          <span>Résumer un document</span>
          <span>Explorer les informations</span>
          <span>Poser une question</span>
        </div>

        <RouterLink to="/chat" class="assistant-button">
          Ouvrir l'assistant
          <span>↗</span>
        </RouterLink>

        <div class="assistant-note">
          Les réponses IA réelles seront disponibles après
          la connexion du moteur d'intelligence artificielle.
        </div>
      </section>
    </div>

    <!-- ACCÈS RAPIDES -->
    <div class="section-title quick-title">
      <div>
        <h2>Accès rapides</h2>
        <p>Retrouvez vos outils essentiels en un clic</p>
      </div>
    </div>

    <div class="quick-grid">
      <RouterLink to="/documents" class="quick-card">
        <div class="quick-icon">▤</div>
        <div>
          <strong>Bibliothèque documentaire</strong>
          <p>Importer et consulter vos fichiers</p>
        </div>
        <span class="quick-arrow">↗</span>
      </RouterLink>

      <RouterLink to="/analysis" class="quick-card">
        <div class="quick-icon">✦</div>
        <div>
          <strong>Analyse intelligente</strong>
          <p>Explorer les outils d'analyse</p>
        </div>
        <span class="quick-arrow">↗</span>
      </RouterLink>

      <RouterLink to="/history" class="quick-card">
        <div class="quick-icon">◷</div>
        <div>
          <strong>Historique</strong>
          <p>Retrouver vos conversations</p>
        </div>
        <span class="quick-arrow">↗</span>
      </RouterLink>
    </div>

    <!-- ACTIVITÉS -->
    <section class="panel activity-panel">
      <div class="panel-heading">
        <div>
          <span class="section-kicker">ACTIVITY CENTER</span>
          <h3>Activités récentes</h3>
          <p>Exemples d'événements de la plateforme</p>
        </div>

        <span class="demo-label">Démonstration</span>
      </div>

      <div class="activity-list">
        <div
          v-for="activite in activites"
          :key="activite.nom"
          class="activity-item"
        >
          <div class="activity-icon">{{ activite.icone }}</div>

          <div class="activity-info">
            <strong>{{ activite.nom }}</strong>
            <span>{{ activite.detail }}</span>
          </div>

          <div class="activity-meta">
            <span class="activity-type">{{ activite.type }}</span>
            <small>{{ activite.date }}</small>
          </div>
        </div>
      </div>
    </section>

    <footer class="dashboard-footer">
      <span>COSIDER AI — Plateforme d'intelligence documentaire</span>
      <span>Interface de démonstration</span>
    </footer>

  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 27px;
  color: #202634;
}

.dashboard-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.6px;
  color: #b51226;
  margin-bottom: 12px;
}

.eyebrow-line {
  width: 21px;
  height: 2px;
  background: #b51226;
}

.dashboard-heading h1 {
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
  margin: 0;
}

.dashboard-heading h1 span {
  color: #b51226;
}

.dashboard-heading p {
  margin: 10px 0 0;
  color: #87909e;
  font-size: 13px;
  line-height: 1.7;
}

.date-chip {
  padding: 12px 16px;
  background: white;
  border: 1px solid #ebedf2;
  border-radius: 11px;
  font-size: 11px;
  font-weight: 700;
  color: #6f7888;
  text-transform: capitalize;
}

.date-chip span {
  color: #b51226;
  margin-right: 7px;
}

.hero {
  min-height: 310px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 40px 45px;
  border-radius: 22px;
  background: linear-gradient(115deg, #a60e22 0%, #c71933 55%, #e2465b 100%);
  color: white;
  box-shadow: 0 18px 36px rgba(181, 18, 38, 0.12);
}

.hero-decoration {
  position: absolute;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 50%;
  pointer-events: none;
}

.hero-decoration-one {
  width: 530px;
  height: 530px;
  right: -170px;
  top: -210px;
}

.hero-decoration-two {
  width: 370px;
  height: 370px;
  right: -70px;
  bottom: -240px;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 620px;
}

.hero-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid rgba(255,255,255,.25);
  background: rgba(255,255,255,.1);
  border-radius: 50px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.hero-sparkle {
  font-size: 16px;
}

.hero h2 {
  font-size: clamp(28px, 3.2vw, 43px);
  line-height: 1.22;
  letter-spacing: -1.5px;
  margin: 21px 0 15px;
  font-weight: 800;
}

.hero h2 span {
  color: #ffd8df;
}

.hero p {
  font-size: 13px;
  line-height: 1.9;
  color: #ffe5e9;
  max-width: 490px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
  margin-top: 24px;
}

.hero-primary,
.hero-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 12px 17px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  transition: all .2s;
}

.hero-primary {
  background: white;
  color: #ad1025;
}

.hero-secondary {
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.25);
  color: white;
}

.hero-primary:hover,
.hero-secondary:hover {
  transform: translateY(-2px);
}

.hero-visual {
  position: absolute;
  width: 310px;
  height: 310px;
  right: 55px;
  top: 0;
  display: grid;
  place-items: center;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 50%;
}

.orbit-one { width: 155px; height: 155px; }
.orbit-two { width: 235px; height: 235px; }
.orbit-three { width: 305px; height: 305px; }

.ai-core {
  width: 112px;
  height: 112px;
  border-radius: 28px;
  background: rgba(255,255,255,.18);
  border: 1px solid rgba(255,255,255,.4);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-shadow: 0 20px 50px rgba(80,0,15,.2);
}

.ai-core span {
  font-size: 24px;
}

.ai-core strong {
  font-size: 37px;
  font-weight: 800;
}

.floating-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  color: #263040;
  padding: 12px 14px;
  border-radius: 12px;
  box-shadow: 0 12px 35px rgba(70,0,15,.18);
}

.floating-card > span {
  color: #c71933;
  font-size: 20px;
}

.floating-card div {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.floating-card strong { font-size: 10px; }
.floating-card small { font-size: 9px; color: #87909e; }

.floating-card-top { right: -8px; top: 49px; }
.floating-card-bottom { left: -15px; bottom: 48px; }

.section-title,
.panel-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.section-title h2 {
  font-size: 19px;
  font-weight: 800;
  margin: 0;
}

.section-title p,
.panel-heading p {
  font-size: 12px;
  color: #939baa;
  margin: 6px 0 0;
}

.demo-label {
  font-size: 10px;
  font-weight: 700;
  color: #9a6670;
  background: #fff1f3;
  padding: 8px 11px;
  border-radius: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card,
.panel,
.quick-card {
  background: white;
  border: 1px solid #eaecf1;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(30,35,50,.025);
}

.stat-card {
  padding: 22px;
}

.stat-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.stat-icon {
  width: 46px;
  height: 46px;
  border-radius: 13px;
  display: grid;
  place-items: center;
  font-size: 23px;
}

.stat-icon.red { background: #fff0f2; color: #c71933; }
.stat-icon.purple { background: #f2edff; color: #8053cb; }
.stat-icon.blue { background: #eaf2ff; color: #487ed2; }
.stat-icon.green { background: #e8f8ef; color: #219668; }

.stat-trend {
  font-size: 10px;
  font-weight: 800;
  color: #219668;
  background: #eaf8f0;
  padding: 6px 9px;
  border-radius: 7px;
}

.stat-value {
  margin-top: 22px;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -1px;
}

.stat-name {
  font-size: 12px;
  color: #7e8795;
  margin-top: 5px;
}

.stat-footer {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  color: #a2a9b4;
  border-top: 1px solid #f0f1f4;
  margin-top: 18px;
  padding-top: 13px;
}

.mini-dot,
.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #c71933;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 17px;
}

.panel {
  padding: 25px;
}

.panel-heading h3 {
  font-size: 17px;
  margin: 6px 0 0;
}

.section-kicker {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.3px;
  color: #c71933;
}

.period-select {
  padding: 9px 13px;
  border: 1px solid #e9ebf0;
  border-radius: 9px;
  background: #fafbfc;
  color: #657081;
  font-size: 11px;
  outline: none;
}

.chart {
  height: 225px;
  margin-top: 26px;
  position: relative;
}

.chart-lines {
  position: absolute;
  inset: 0 0 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-lines span {
  border-top: 1px dashed #edf0f3;
}

.chart-bars {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 17px;
  height: 100%;
}

.bar-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.bar-track {
  height: 200px;
  width: 100%;
  max-width: 36px;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  border-radius: 7px 7px 3px 3px;
  background: linear-gradient(180deg, #e95368, #b51226);
  transition: height .35s ease;
}

.bar-column small {
  color: #9ca4b0;
  font-size: 10px;
}

.chart-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 10px;
  color: #939baa;
}

.assistant-panel {
  background: linear-gradient(150deg, #fff, #fff7f8);
  display: flex;
  flex-direction: column;
}

.assistant-header {
  display: flex;
  align-items: center;
  gap: 11px;
}

.assistant-icon {
  width: 43px;
  height: 43px;
  border-radius: 13px;
  background: #b51226;
  color: white;
  display: grid;
  place-items: center;
  font-size: 25px;
}

.assistant-header > span {
  font-size: 10px;
  color: #b51226;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.assistant-panel h3 {
  font-size: clamp(21px, 2.2vw, 29px);
  line-height: 1.35;
  margin: 23px 0 12px;
}

.assistant-panel h3 span {
  color: #b51226;
}

.assistant-panel > p {
  color: #8992a0;
  font-size: 12px;
  line-height: 1.9;
}

.assistant-suggestions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 20px 0;
}

.assistant-suggestions span {
  background: white;
  border: 1px solid #f1dce0;
  color: #a45a66;
  font-size: 10px;
  padding: 8px 10px;
  border-radius: 8px;
}

.assistant-button {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #b51226;
  color: white;
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
}

.assistant-button:hover {
  background: #951020;
}

.assistant-note {
  color: #a3a9b3;
  font-size: 10px;
  line-height: 1.6;
  margin-top: 14px;
}

.quick-title {
  margin-top: 2px;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.quick-card {
  padding: 21px;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all .2s;
}

.quick-card:hover {
  transform: translateY(-3px);
  border-color: #f1c6cd;
  box-shadow: 0 12px 30px rgba(181,18,38,.07);
}

.quick-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #fff0f2;
  color: #b51226;
  font-size: 22px;
  flex-shrink: 0;
}

.quick-card strong {
  font-size: 12px;
}

.quick-card p {
  color: #9ba3af;
  font-size: 10px;
  margin: 5px 0 0;
}

.quick-arrow {
  margin-left: auto;
  color: #b51226;
  font-size: 18px;
}

.activity-panel {
  margin-top: 1px;
}

.activity-list {
  margin-top: 21px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f1f4;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background: #fff0f2;
  color: #b51226;
  display: grid;
  place-items: center;
  font-size: 21px;
}

.activity-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.activity-info strong {
  font-size: 12px;
}

.activity-info > span {
  font-size: 11px;
  color: #9ba3af;
}

.activity-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
}

.activity-type {
  background: #fff0f2;
  color: #b51226;
  padding: 5px 9px;
  border-radius: 7px;
  font-size: 10px;
  font-weight: 700;
}

.activity-meta small {
  font-size: 10px;
  color: #a4abb6;
}

.dashboard-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #a0a8b3;
  font-size: 10px;
  padding: 5px 0;
}

@media (max-width: 1250px) {
  .hero-visual {
    opacity: .45;
    right: -10px;
  }

  .hero-content {
    max-width: 580px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    display: none;
  }
}

@media (max-width: 600px) {
  .hero {
    padding: 29px 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .panel {
    padding: 19px;
  }

  .dashboard-footer {
    flex-direction: column;
  }

  .activity-meta {
    display: none;
  }
}
</style>
