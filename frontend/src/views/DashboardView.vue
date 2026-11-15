
<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Données de démonstration
const statistiques = ref([
  {
    titre: 'Documents',
    valeur: '1 248',
    evolution: '+12%',
    icone: 'document'
  },
  {
    titre: 'Analyses',
    valeur: '326',
    evolution: '+8%',
    icone: 'analyse'
  },
  {
    titre: 'Conversations IA',
    valeur: '892',
    evolution: '+15%',
    icone: 'chat'
  },
  {
    titre: 'Données (Entrepôt)',
    valeur: '15,6 Go',
    evolution: '+20%',
    icone: 'database'
  }
])

const activites = [
  { mois: 'Mai', valeur: 50 },
  { mois: 'Juin', valeur: 75 },
  { mois: 'Juil', valeur: 100 },
  { mois: 'Août', valeur: 125 },
  { mois: 'Sep', valeur: 150 },
  { mois: 'Oct', valeur: 180 },
  { mois: 'Nov', valeur: 210 }
]

const typesDocuments = [
  { nom: 'Rapports', pourcentage: 42, couleur: '#d50020' },
  { nom: 'Contrats', pourcentage: 24, couleur: '#f18c98' },
  { nom: 'Marchés', pourcentage: 18, couleur: '#f8c8cf' },
  { nom: 'Autres', pourcentage: 16, couleur: '#d9dadd' }
]

const documents = ref([
  {
    nom: 'Rapport_avancement_projet.pdf',
    type: 'Rapport',
    categorie: 'rapport',
    date: '15/11/2026 - 09:20'
  },
  {
    nom: 'Contrat_marché_TP.pdf',
    type: 'Contrat',
    categorie: 'contrat',
    date: '14/11/2026 - 16:45'
  },
  {
    nom: 'Cahier_des_charges.pdf',
    type: 'Marché',
    categorie: 'marche',
    date: '14/11/2026 - 11:30'
  }
])

function ouvrirDocumentDemo() {
  window.alert(
    'Ce document est un exemple de la maquette. ' +
    'Les documents réellement importés seront connectés ensuite.'
  )
}
</script>

<template>
  <div class="cosider-dashboard">

    <!-- BANNIÈRE DE BIENVENUE -->
    <section class="welcome-banner">

      <div class="welcome-text">
        <h1>
          <span class="red-slash">╱</span>
          Bienvenue sur <span>COSIDER AI</span>
        </h1>

        <p>
          L'assistant intelligent pour la gestion, l'analyse
          et la valorisation<br class="desktop-break" />
          de vos documents d'entreprise.
        </p>
      </div>

      <div class="construction-photo"></div>
      <div class="construction-red-shape"></div>

    </section>

    <!-- STATISTIQUES -->
    <section class="stats-grid">

      <article
        v-for="stat in statistiques"
        :key="stat.titre"
        class="stat-card"
      >
        <div class="stat-icon">

          <svg
            v-if="stat.icone === 'document'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
          >
            <path d="M6 2h8l5 5v14H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/>
            <path d="M14 2v6h5M8 13h8M8 17h8"/>
          </svg>

          <svg
            v-else-if="stat.icone === 'analyse'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
          >
            <path d="m12 2 9 5-9 5-9-5 9-5Z"/>
            <path d="m3 12 9 5 9-5M3 17l9 5 9-5"/>
          </svg>

          <svg
            v-else-if="stat.icone === 'chat'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
          >
            <path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-4.5A8.5 8.5 0 1 1 20 11.5Z"/>
            <path d="M8 12h.01M12 12h.01M16 12h.01"/>
          </svg>

          <svg
            v-else
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
          >
            <ellipse cx="12" cy="5" rx="9" ry="3"/>
            <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/>
            <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>
          </svg>

        </div>

        <div class="stat-content">
          <span class="stat-title">{{ stat.titre }}</span>

          <div class="stat-bottom">
            <strong>{{ stat.valeur }}</strong>
            <span class="stat-growth">↑ {{ stat.evolution }}</span>
          </div>
        </div>
      </article>

    </section>

    <!-- GRAPHIQUES ET ACTIONS -->
    <section class="analytics-grid">

      <!-- ACTIVITÉ DES DOCUMENTS -->
      <article class="dashboard-card activity-card">
        <h2 class="card-title">
          <span class="title-icon">▥</span>
          Activité des documents
        </h2>

        <div class="bar-chart">

          <div class="chart-scale">
            <span>250</span>
            <span>200</span>
            <span>150</span>
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>

          <div class="chart-area">
            <div class="grid-lines">
              <span v-for="n in 6" :key="n"></span>
            </div>

            <div class="chart-columns">
              <div
                v-for="(item, index) in activites"
                :key="item.mois"
                class="chart-column"
              >
                <div class="bar-container">
                  <div
                    class="chart-bar"
                    :class="{ 'last-bar': index === activites.length - 1 }"
                    :style="{ height: (item.valeur / 250 * 100) + '%' }"
                  ></div>
                </div>

                <span class="month-label">{{ item.mois }}</span>
              </div>
            </div>
          </div>

        </div>
      </article>

      <!-- TYPES DE DOCUMENTS -->
      <article class="dashboard-card types-card">
        <h2 class="card-title">
          <span class="title-icon">▥</span>
          Types de documents
        </h2>

        <div class="types-content">

          <div class="donut-chart">
            <div class="donut-center">
              <strong>1 248</strong>
              <span>Documents</span>
            </div>
          </div>

          <div class="types-legend">
            <div
              v-for="type in typesDocuments"
              :key="type.nom"
              class="legend-row"
            >
              <span
                class="legend-color"
                :style="{ background: type.couleur }"
              ></span>

              <span class="legend-name">{{ type.nom }}</span>

              <strong>{{ type.pourcentage }}%</strong>
            </div>
          </div>

        </div>
      </article>

      <!-- ACTIONS RAPIDES -->
      <article class="dashboard-card actions-card">
        <h2 class="card-title">
          <span class="title-icon">ϟ</span>
          Actions rapides
        </h2>

        <div class="actions-list">

          <RouterLink
            to="/documents"
            class="action-button primary-action"
          >
            <span>⇧</span>
            Importer un document
          </RouterLink>

          <RouterLink to="/chat" class="action-button">
            <span>☏</span>
            Poser une question à l'IA
          </RouterLink>

          <RouterLink to="/analysis" class="action-button">
            <span>▥</span>
            Lancer une analyse
          </RouterLink>

          <RouterLink to="/warehouse" class="action-button">
            <span>▤</span>
            Accéder à l'entrepôt de données
          </RouterLink>

        </div>
      </article>

    </section>

    <!-- PARTIE INFÉRIEURE -->
    <section class="bottom-grid">

      <!-- DOCUMENTS RÉCENTS -->
      <article class="dashboard-card recent-documents">

        <div class="documents-header">
          <h2 class="card-title">
            <span class="title-icon">▤</span>
            Documents récents
          </h2>

          <RouterLink to="/documents" class="view-all">
            Voir tout →
          </RouterLink>
        </div>

        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom du document</th>
                <th>Type</th>
                <th>Date d'ajout</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="doc in documents" :key="doc.nom">
                <td class="document-name">
                  <span class="pdf-icon">PDF</span>
                  {{ doc.nom }}
                </td>

                <td>
                  <span
                    class="type-badge"
                    :class="doc.categorie"
                  >
                    {{ doc.type }}
                  </span>
                </td>

                <td class="document-date">
                  {{ doc.date }}
                </td>

                <td>
                  <button
                    class="view-button"
                    type="button"
                    title="Consulter"
                    @click="ouvrirDocumentDemo"
                  >
                    ◉
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </article>

      <!-- ENTREPÔT DE DONNÉES -->
      <article class="dashboard-card warehouse-card">

        <div class="warehouse-content">
          <h2 class="card-title">
            <span class="title-icon">▤</span>
            Accès à l'entrepôt de données
          </h2>

          <p>
            Consultez et analysez les données consolidées
            de l'entreprise.
          </p>

          <RouterLink to="/warehouse" class="warehouse-link">
            Ouvrir l'entrepôt
            <span>→</span>
          </RouterLink>
        </div>

        <div class="warehouse-illustration" aria-hidden="true">
          <div class="database-top"></div>
          <div class="database-layer layer-one"></div>
          <div class="database-layer layer-two"></div>
          <div class="database-layer layer-three"></div>
        </div>

      </article>

    </section>

    <p class="demo-notice">
      Aperçu de démonstration — les indicateurs seront connectés
      aux données réelles ultérieurement.
    </p>

  </div>
</template>

<style scoped>
/* TABLEAU DE BORD */
.cosider-dashboard {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  color: #16191f;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
}

/* BANNIÈRE */
.welcome-banner {
  position: relative;
  min-height: 175px;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  margin: -24px -24px 0;
  padding: 34px 40px;
  background: #fff;
}

.welcome-text {
  position: relative;
  z-index: 3;
  max-width: 700px;
}

.welcome-text h1 {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: clamp(23px, 2.4vw, 34px);
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0 0 10px;
  line-height: 1.3;
}

.welcome-text h1 span:last-child {
  color: #c90020;
}

.red-slash {
  color: #d00020;
  font-size: 36px;
  font-weight: 900;
  margin-right: 6px;
}

.welcome-text p {
  font-size: 14px;
  line-height: 1.65;
  color: #454b55;
  margin-left: 33px;
}

.construction-photo {
  position: absolute;
  top: 0;
  right: 0;
  width: 48%;
  height: 100%;
  background:
    linear-gradient(90deg, rgba(255,255,255,.1), transparent),
    url('/images/chantier.jpg') center / cover no-repeat;
  clip-path: polygon(26% 0, 100% 0, 100% 100%, 0 100%);
}

.construction-red-shape {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 15%;
  background: linear-gradient(135deg, #c90020cc, #d90020);
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
}

/* STATISTIQUES */
.stats-grid {
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin: -5px 0 20px;
}

.stat-card {
  background: #fff;
  min-height: 105px;
  border-radius: 14px;
  border: 1px solid #eeeeef;
  box-shadow: 0 6px 24px rgba(30, 35, 45, .06);
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  width: 55px;
  height: 55px;
  min-width: 55px;
  border-radius: 50%;
  background: #fce9ec;
  color: #d00020;
  display: grid;
  place-items: center;
}

.stat-icon svg {
  width: 29px;
  height: 29px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-title {
  font-size: 12px;
  color: #4b515c;
}

.stat-bottom {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-top: 7px;
}

.stat-bottom strong {
  font-size: clamp(20px, 2vw, 29px);
  font-weight: 800;
  letter-spacing: -.8px;
  white-space: nowrap;
}

.stat-growth {
  color: #07843d;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

/* CARTES */
.analytics-grid {
  display: grid;
  grid-template-columns: 1.35fr 1.05fr .85fr;
  gap: 18px;
  margin-bottom: 20px;
}

.dashboard-card {
  background: #fff;
  border: 1px solid #ededf0;
  border-radius: 16px;
  box-shadow: 0 5px 18px rgba(35, 40, 50, .045);
  padding: 20px;
  min-width: 0;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 800;
  margin: 0;
  line-height: 1.4;
}

.title-icon {
  width: 29px;
  height: 29px;
  min-width: 29px;
  border-radius: 8px;
  background: #ffedf0;
  color: #d00020;
  display: grid;
  place-items: center;
  font-size: 19px;
}

/* GRAPHIQUE EN BARRES */
.bar-chart {
  display: flex;
  gap: 12px;
  height: 218px;
  margin-top: 23px;
}

.chart-scale {
  width: 30px;
  height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: right;
  color: #616875;
  font-size: 11px;
}

.chart-area {
  flex: 1;
  min-width: 0;
  height: 218px;
  position: relative;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-lines span {
  border-top: 1px solid #eceef0;
}

.chart-columns {
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 9px;
  padding: 0 5px;
}

.chart-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.bar-container {
  height: 190px;
  width: 100%;
  max-width: 38px;
  display: flex;
  align-items: flex-end;
}

.chart-bar {
  width: 100%;
  background: linear-gradient(180deg, #ef9aa5, #f6c7ce);
  border-radius: 5px 5px 0 0;
  transition: height .3s ease;
}

.chart-bar.last-bar {
  background: linear-gradient(180deg, #d50020, #bd001b);
}

.month-label {
  margin-top: 9px;
  color: #4b515c;
  font-size: 10px;
}

/* GRAPHIQUE CIRCULAIRE */
.types-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 240px;
}

.donut-chart {
  width: 174px;
  height: 174px;
  min-width: 174px;
  border-radius: 50%;
  background: conic-gradient(
    #d50020 0% 42%,
    #f18c98 42% 66%,
    #f8c8cf 66% 84%,
    #d9dadd 84% 100%
  );
  display: grid;
  place-items: center;
}

.donut-center {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.donut-center strong {
  font-size: 25px;
  font-weight: 800;
}

.donut-center span {
  font-size: 12px;
  color: #555e6a;
}

.types-legend {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  min-width: 95px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
}

.legend-color {
  width: 11px;
  height: 11px;
  min-width: 11px;
  border-radius: 3px;
}

.legend-name {
  flex: 1;
  color: #555c67;
}

.legend-row strong {
  font-size: 12px;
}

/* ACTIONS RAPIDES */
.actions-list {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 21px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 43px;
  padding: 9px 12px;
  border-radius: 9px;
  background: #f3f4f6;
  color: #191b20;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
  transition: background .2s;
}

.action-button:hover {
  background: #ffe6ea;
}

.action-button span {
  font-size: 20px;
  min-width: 20px;
  text-align: center;
}

.primary-action {
  background: #d00020;
  color: #fff;
}

.primary-action:hover {
  background: #ae001b;
}

/* BAS DU TABLEAU DE BORD */
.bottom-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 18px;
}

.documents-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 17px;
}

.view-all {
  color: #d00020;
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background: #f4f5f7;
}

th {
  font-size: 11px;
  font-weight: 700;
  color: #333b46;
  padding: 11px;
  white-space: nowrap;
}

td {
  padding: 11px;
  border-bottom: 1px solid #eef0f2;
  font-size: 11px;
  color: #4d5561;
}

tbody tr:last-child td {
  border-bottom: none;
}

.document-name {
  font-weight: 700;
  color: #23262d;
  white-space: nowrap;
}

.pdf-icon {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 29px;
  background: #d00020;
  border-radius: 4px;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  margin-right: 9px;
}

.type-badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
}

.type-badge.rapport {
  background: #ffe0e4;
  color: #b8001b;
}

.type-badge.contrat {
  background: #e1efff;
  color: #15528d;
}

.type-badge.marche {
  background: #fff0dc;
  color: #875119;
}

.document-date {
  white-space: nowrap;
}

.view-button {
  border: none;
  background: transparent;
  color: #242a32;
  font-size: 19px;
  cursor: pointer;
}

/* ENTREPÔT DE DONNÉES */
.warehouse-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 225px;
  overflow: hidden;
}

.warehouse-content {
  position: relative;
  z-index: 2;
  flex: 1;
}

.warehouse-content p {
  font-size: 12px;
  color: #555e6a;
  line-height: 1.7;
  max-width: 300px;
  margin: 19px 0 25px;
}

.warehouse-link {
  display: inline-flex;
  align-items: center;
  gap: 15px;
  padding: 10px 17px;
  border: 1px solid #d00020;
  border-radius: 9px;
  color: #c0001d;
  text-decoration: none;
  font-size: 12px;
  font-weight: 800;
}

.warehouse-link:hover {
  background: #fff0f2;
}

.warehouse-illustration {
  position: relative;
  width: 105px;
  height: 125px;
  flex-shrink: 0;
}

.database-top,
.database-layer {
  position: absolute;
  left: 0;
  width: 100%;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(120deg, #ffd8dd, #f0a6b2);
}

.database-top {
  top: 0;
  z-index: 4;
}

.database-layer {
  border-radius: 0 0 50% 50%;
  border-bottom: 7px solid white;
  background: linear-gradient(120deg, #ffe4e8, #ef9ead);
}

.layer-one {
  top: 22px;
  z-index: 3;
}

.layer-two {
  top: 47px;
  z-index: 2;
}

.layer-three {
  top: 72px;
  z-index: 1;
}

.demo-notice {
  margin-top: 16px;
  font-size: 10px;
  color: #9298a2;
  text-align: right;
}

/* RESPONSIVE */
@media (max-width: 1350px) {
  .analytics-grid {
    grid-template-columns: 1.2fr 1fr;
  }

  .actions-card {
    grid-column: 1 / -1;
  }

  .actions-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .types-content {
    gap: 12px;
  }

  .donut-chart {
    width: 145px;
    height: 145px;
    min-width: 145px;
  }

  .donut-center {
    width: 95px;
    height: 95px;
  }
}

@media (max-width: 1050px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bottom-grid {
    grid-template-columns: 1fr;
  }

  .welcome-text {
    max-width: 65%;
  }

  .welcome-text h1 {
    font-size: 25px;
  }
}

@media (max-width: 750px) {
  .welcome-banner {
    margin: -16px -16px 0;
    padding: 28px 20px;
    min-height: 200px;
  }

  .welcome-text {
    max-width: 100%;
  }

  .construction-photo {
    opacity: .18;
    width: 75%;
  }

  .construction-red-shape {
    opacity: .3;
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .actions-card {
    grid-column: auto;
  }

  .types-content {
    justify-content: flex-start;
  }
}

@media (max-width: 500px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-list {
    grid-template-columns: 1fr;
  }

  .welcome-text h1 {
    font-size: 23px;
  }

  .welcome-text p {
    margin-left: 0;
    font-size: 12px;
  }

  .desktop-break {
    display: none;
  }

  .dashboard-card {
    padding: 15px;
  }

  .types-content {
    flex-direction: column;
  }

  .types-legend {
    width: 100%;
  }

  .warehouse-illustration {
    display: none;
  }
}
</style>
