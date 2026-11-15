
<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

// Données de démonstration : connexion au backend à venir
const recherche = ref('')
const filtre = ref('Tous')

const categories = ['Tous', 'Projets', 'Finances', 'Documents', 'Ressources humaines']

const donnees = ref([
  {
    id: 1,
    nom: 'Projets de construction',
    categorie: 'Projets',
    description: 'Suivi des projets et avancement des chantiers',
    enregistrements: '1 248',
    miseAJour: '15/11/2026',
    statut: 'Disponible'
  },
  {
    id: 2,
    nom: 'Données financières',
    categorie: 'Finances',
    description: 'Budgets, dépenses et prévisions financières',
    enregistrements: '856',
    miseAJour: '14/11/2026',
    statut: 'Disponible'
  },
  {
    id: 3,
    nom: 'Archives documentaires',
    categorie: 'Documents',
    description: 'Rapports, contrats et documents administratifs',
    enregistrements: '3 420',
    miseAJour: '13/11/2026',
    statut: 'Disponible'
  },
  {
    id: 4,
    nom: 'Ressources humaines',
    categorie: 'Ressources humaines',
    description: 'Effectifs, services et informations organisationnelles',
    enregistrements: '642',
    miseAJour: '12/11/2026',
    statut: 'En préparation'
  }
])

const donneesFiltrees = computed(() => {
  const texte = recherche.value.trim().toLowerCase()

  return donnees.value.filter(item => {
    const correspondCategorie =
      filtre.value === 'Tous' || item.categorie === filtre.value

    const correspondRecherche =
      !texte ||
      item.nom.toLowerCase().includes(texte) ||
      item.description.toLowerCase().includes(texte) ||
      item.categorie.toLowerCase().includes(texte)

    return correspondCategorie && correspondRecherche
  })
})

function consulter(item) {
  window.alert(
    `« ${item.nom} » est un jeu de données de démonstration.\n\n` +
    'La consultation des données réelles sera disponible après ' +
    'la connexion de l’entrepôt au backend.'
  )
}
</script>

<template>
  <div class="warehouse-page">

    <!-- TITRE -->
    <div class="page-heading">
      <div>
        <p class="eyebrow">COSIDER CONSTRUCTION AI</p>
        <h1>Entrepôt de données</h1>
        <p class="subtitle">
          Centralisez, organisez et explorez les données de votre entreprise.
        </p>
      </div>

      <span class="demo-badge">Mode démonstration</span>
    </div>

    <!-- BANNIÈRE -->
    <section class="warehouse-hero">
      <div class="hero-content">
        <span class="hero-label">DATA WAREHOUSE</span>

        <h2>Vos données, au cœur de vos décisions.</h2>

        <p>
          Retrouvez les informations de vos projets, de vos documents
          et de vos activités dans un espace centralisé.
        </p>

        <RouterLink to="/" class="hero-link">
          Retour au tableau de bord
          <span>→</span>
        </RouterLink>
      </div>

      <div class="hero-decoration" aria-hidden="true">
        <div class="database-top"></div>
        <div class="database-body"></div>
        <div class="database-line line-one"></div>
        <div class="database-line line-two"></div>
      </div>
    </section>

    <!-- INDICATEURS -->
    <section class="stats-grid">
      <article class="stat-card">
        <div class="stat-icon">▤</div>
        <div>
          <p>Sources de données</p>
          <strong>04</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon">▦</div>
        <div>
          <p>Enregistrements</p>
          <strong>6 166</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon">◫</div>
        <div>
          <p>Volume stocké</p>
          <strong>15,6 Go</strong>
        </div>
      </article>

      <article class="stat-card">
        <div class="stat-icon">✓</div>
        <div>
          <p>Sources disponibles</p>
          <strong>03 / 04</strong>
        </div>
      </article>
    </section>

    <!-- CATALOGUE -->
    <section class="catalogue-card">

      <div class="catalogue-heading">
        <div>
          <h2>Catalogue des données</h2>
          <p>Explorez les différentes sources de l'entrepôt.</p>
        </div>

        <span class="result-count">
          {{ donneesFiltrees.length }} résultat(s)
        </span>
      </div>

      <!-- RECHERCHE ET FILTRE -->
      <div class="filters">
        <div class="search-field">
          <span>⌕</span>
          <input
            v-model="recherche"
            type="search"
            placeholder="Rechercher une source de données..."
            aria-label="Rechercher une source"
          />
        </div>

        <select v-model="filtre" aria-label="Filtrer par catégorie">
          <option
            v-for="categorie in categories"
            :key="categorie"
            :value="categorie"
          >
            {{ categorie }}
          </option>
        </select>
      </div>

      <!-- TABLEAU -->
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>SOURCE DE DONNÉES</th>
              <th>CATÉGORIE</th>
              <th>ENREGISTREMENTS</th>
              <th>MISE À JOUR</th>
              <th>STATUT</th>
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in donneesFiltrees" :key="item.id">
              <td>
                <div class="source-cell">
                  <span class="source-icon">▤</span>

                  <div>
                    <strong>{{ item.nom }}</strong>
                    <small>{{ item.description }}</small>
                  </div>
                </div>
              </td>

              <td>{{ item.categorie }}</td>

              <td class="record-count">
                {{ item.enregistrements }}
              </td>

              <td>{{ item.miseAJour }}</td>

              <td>
                <span
                  class="status-badge"
                  :class="item.statut === 'Disponible' ? 'available' : 'pending'"
                >
                  {{ item.statut }}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  class="view-button"
                  @click="consulter(item)"
                >
                  Consulter →
                </button>
              </td>
            </tr>

            <tr v-if="donneesFiltrees.length === 0">
              <td colspan="6" class="empty-state">
                Aucune source ne correspond à votre recherche.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- INFORMATION -->
    <div class="info-footer">
      <span class="info-icon">i</span>
      <p>
        Cet entrepôt présente actuellement des données fictives.
        La connexion aux bases de données et les traitements ETL
        seront développés dans les prochaines étapes.
      </p>
    </div>

  </div>
</template>

<style scoped>
.warehouse-page {
  max-width: 1500px;
  margin: 0 auto;
  padding-bottom: 35px;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  color: #20232b;
}

/* EN-TÊTE */
.page-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.eyebrow {
  color: #c90020;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
  margin-bottom: 8px;
}

.page-heading h1 {
  font-size: 29px;
  font-weight: 800;
  letter-spacing: -.8px;
  margin: 0 0 7px;
}

.subtitle {
  color: #858b96;
  font-size: 13px;
}

.demo-badge {
  background: #fff1f3;
  border: 1px solid #f6d6dc;
  color: #c90020;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

/* BANNIÈRE */
.warehouse-hero {
  position: relative;
  min-height: 220px;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 15px;
  background:
    linear-gradient(110deg, #850015 0%, #bf001d 65%, #e32742 100%);
  color: #fff;
  margin-bottom: 22px;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 30px 36px;
  max-width: 670px;
}

.hero-label {
  display: inline-block;
  background: #ffffff25;
  border: 1px solid #ffffff35;
  padding: 7px 11px;
  border-radius: 6px;
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: 800;
  margin-bottom: 14px;
}

.hero-content h2 {
  font-size: clamp(23px, 3vw, 33px);
  line-height: 1.2;
  font-weight: 800;
  margin-bottom: 12px;
}

.hero-content p {
  max-width: 510px;
  font-size: 13px;
  line-height: 1.8;
  color: #ffe5e9;
  margin-bottom: 19px;
}

.hero-link {
  display: inline-flex;
  gap: 20px;
  align-items: center;
  background: white;
  color: #ad001c;
  padding: 11px 15px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
}

.hero-decoration {
  position: absolute;
  right: 7%;
  top: 38px;
  width: 175px;
  height: 160px;
  opacity: .5;
}

.database-top {
  position: absolute;
  top: 0;
  width: 175px;
  height: 55px;
  border-radius: 50%;
  background: #fff;
}

.database-body {
  position: absolute;
  top: 26px;
  width: 175px;
  height: 117px;
  border-radius: 0 0 50% 50%;
  background: #ffffffb0;
}

.database-line {
  position: absolute;
  width: 175px;
  height: 40px;
  border-radius: 50%;
  border-bottom: 7px solid #fff;
}

.line-one {
  top: 57px;
}

.line-two {
  top: 96px;
}

/* STATISTIQUES */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 17px;
  margin-bottom: 23px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 22px;
  background: #fff;
  border: 1px solid #eceef1;
  border-radius: 13px;
  box-shadow: 0 4px 15px #1b243008;
}

.stat-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  background: #fff0f2;
  color: #c90020;
  font-size: 25px;
}

.stat-card p {
  font-size: 12px;
  color: #89909b;
  margin-bottom: 6px;
}

.stat-card strong {
  font-size: 25px;
  font-weight: 800;
}

/* CATALOGUE */
.catalogue-card {
  background: #fff;
  border: 1px solid #eceef1;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 4px 16px #1b243008;
}

.catalogue-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.catalogue-heading h2 {
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 6px;
}

.catalogue-heading p {
  font-size: 12px;
  color: #9298a3;
}

.result-count {
  color: #b5001c;
  background: #fff0f2;
  padding: 8px 11px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 800;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  border: 1px solid #e9ebef;
  border-radius: 9px;
  padding: 0 13px;
}

.search-field span {
  font-size: 25px;
  color: #777f8c;
}

.search-field input {
  flex: 1;
  min-width: 0;
  padding: 13px 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 12px;
}

.filters select {
  min-width: 185px;
  border: 1px solid #e9ebef;
  background: #f8f9fa;
  border-radius: 9px;
  padding: 0 13px;
  font-size: 12px;
  color: #4b5563;
  outline: none;
}

/* TABLEAU */
.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

thead {
  background: #f7f8fa;
}

th {
  color: #9097a3;
  font-size: 10px;
  letter-spacing: .6px;
  font-weight: 800;
  padding: 15px 12px;
  white-space: nowrap;
}

td {
  border-bottom: 1px solid #f0f1f3;
  padding: 17px 12px;
  color: #6b7380;
  font-size: 12px;
}

tbody tr:last-child td {
  border-bottom: none;
}

.source-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 240px;
}

.source-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;
  display: grid;
  place-items: center;
  background: #fff0f2;
  border-radius: 9px;
  color: #c90020;
  font-size: 20px;
}

.source-cell div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.source-cell strong {
  font-size: 12px;
  color: #242a35;
}

.source-cell small {
  font-size: 10px;
  color: #9aa0aa;
}

.record-count {
  color: #222832;
  font-weight: 800;
}

.status-badge {
  display: inline-block;
  padding: 7px 10px;
  border-radius: 7px;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.available {
  background: #e8f7ee;
  color: #19854b;
}

.pending {
  background: #fff3dc;
  color: #a87316;
}

.view-button {
  background: transparent;
  border: 1px solid #e9c5cb;
  border-radius: 7px;
  padding: 8px 11px;
  color: #bc001d;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.view-button:hover {
  background: #fff0f2;
}

.empty-state {
  text-align: center;
  padding: 35px;
  color: #9097a3;
}

/* NOTE */
.info-footer {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-top: 18px;
  padding: 16px;
  border: 1px solid #e8ebef;
  background: #fff;
  border-radius: 10px;
}

.info-icon {
  width: 21px;
  height: 21px;
  min-width: 21px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #e9eef5;
  color: #52657e;
  font-size: 12px;
  font-weight: 800;
}

.info-footer p {
  color: #737d8a;
  font-size: 12px;
  line-height: 1.7;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .page-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-content {
    padding: 25px;
  }

  .hero-decoration {
    opacity: .15;
    right: -30px;
  }

  .filters {
    flex-direction: column;
  }

  .filters select {
    min-height: 43px;
  }

  .catalogue-card {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
