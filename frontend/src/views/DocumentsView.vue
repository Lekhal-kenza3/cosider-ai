
<script setup>
import { computed, ref } from 'vue'

// Documents fictifs pour tester le frontend
const documents = ref([
  { id: 1, nom: 'Rapport annuel COSIDER 2025.pdf', type: 'PDF', taille: '2.4 MB', categorie: 'Rapports', date: '05/11/2026', statut: 'Analysé' },
  { id: 2, nom: 'Procédures de sécurité chantier.pdf', type: 'PDF', taille: '1.8 MB', categorie: 'Sécurité', date: '03/11/2026', statut: 'Analysé' },
  { id: 3, nom: 'Planning des travaux.xlsx', type: 'Excel', taille: '845 KB', categorie: 'Planification', date: '01/11/2026', statut: 'En attente' },
  { id: 4, nom: 'Cahier des charges.docx', type: 'Word', taille: '1.2 MB', categorie: 'Technique', date: '29/10/2026', statut: 'Analysé' },
  { id: 5, nom: 'Budget prévisionnel 2026.xlsx', type: 'Excel', taille: '560 KB', categorie: 'Finance', date: '25/10/2026', statut: 'En attente' },
  { id: 6, nom: 'Compte rendu de réunion.pdf', type: 'PDF', taille: '980 KB', categorie: 'Administration', date: '20/10/2026', statut: 'Analysé' },
])

const recherche = ref('')
const filtreType = ref('Tous')
const fileInput = ref(null)

const documentsFiltres = computed(() => {
  return documents.value.filter(doc => {
    const correspondNom = doc.nom.toLowerCase().includes(recherche.value.toLowerCase())
    const correspondType = filtreType.value === 'Tous' || doc.type === filtreType.value
    return correspondNom && correspondType
  })
})

const totalAnalyses = computed(() =>
  documents.value.filter(doc => doc.statut === 'Analysé').length
)

function ouvrirImport() {
  fileInput.value?.click()
}

function ajouterDocuments(event) {
  const fichiers = Array.from(event.target.files || [])

  fichiers.forEach(fichier => {
    const extension = fichier.name.split('.').pop()?.toLowerCase()

    const types = {
      pdf: 'PDF',
      doc: 'Word',
      docx: 'Word',
      xls: 'Excel',
      xlsx: 'Excel'
    }

    if (!types[extension]) return

    documents.value.unshift({
      id: Date.now() + Math.random(),
      nom: fichier.name,
      type: types[extension],
      taille: fichier.size >= 1048576
        ? (fichier.size / 1048576).toFixed(1) + ' MB'
        : (fichier.size / 1024).toFixed(1) + ' KB',
      categorie: 'Non classé',
      date: new Date().toLocaleDateString('fr-FR'),
      statut: 'En attente',
      fichier
    })
  })

  event.target.value = ''
}

function consulterDocument(doc) {
  if (!doc.fichier) {
    alert('Document de démonstration : aucun fichier réel associé.')
    return
  }

  const url = URL.createObjectURL(doc.fichier)
  window.open(url, '_blank')

  setTimeout(() => URL.revokeObjectURL(url), 60000)
}

function supprimerDocument(id) {
  if (confirm('Voulez-vous vraiment supprimer ce document ?')) {
    documents.value = documents.value.filter(doc => doc.id !== id)
  }
}
</script>

<template>
  <div class="documents-page">

    <!-- EN-TÊTE -->
    <div class="page-header">
      <div>
        <h2>Gestion des documents</h2>
        <p>Consultez et organisez les documents de COSIDER AI.</p>
      </div>

      <button class="btn-primary" @click="ouvrirImport">
        + Ajouter des documents
      </button>

      <input
        ref="fileInput"
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        multiple
        hidden
        @change="ajouterDocuments"
      />
    </div>

    <!-- STATISTIQUES -->
    <div class="stats-grid">
      <div class="stat-card">
        <span>Total des documents</span>
        <strong>{{ documents.length }}</strong>
        <small>Documents dans la liste</small>
      </div>

      <div class="stat-card">
        <span>Documents PDF</span>
        <strong>{{ documents.filter(d => d.type === 'PDF').length }}</strong>
        <small>Fichiers PDF</small>
      </div>

      <div class="stat-card">
        <span>Documents analysés</span>
        <strong>{{ totalAnalyses }}</strong>
        <small>Statuts de démonstration</small>
      </div>

      <div class="stat-card">
        <span>En attente</span>
        <strong>{{ documents.filter(d => d.statut === 'En attente').length }}</strong>
        <small>Documents non analysés</small>
      </div>
    </div>

    <!-- LISTE DES DOCUMENTS -->
    <div class="documents-card">
      <div class="section-header">
        <div>
          <h3>Bibliothèque documentaire</h3>
          <p>{{ documentsFiltres.length }} document(s) affiché(s)</p>
        </div>

        <div class="filters">
          <input
            v-model="recherche"
            type="search"
            placeholder="Rechercher un document..."
            class="search-input"
          />

          <select v-model="filtreType" class="filter-select">
            <option>Tous</option>
            <option>PDF</option>
            <option>Word</option>
            <option>Excel</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Document</th>
              <th>Catégorie</th>
              <th>Taille</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="doc in documentsFiltres" :key="doc.id">
              <td>
                <div class="file-cell">
                  <span class="file-icon" :class="doc.type.toLowerCase()">
                    {{ doc.type === 'PDF' ? 'PDF' : doc.type === 'Word' ? 'DOC' : 'XLS' }}
                  </span>
                  <div>
                    <strong>{{ doc.nom }}</strong>
                    <small>{{ doc.type }}</small>
                  </div>
                </div>
              </td>

              <td>{{ doc.categorie }}</td>
              <td>{{ doc.taille }}</td>
              <td>{{ doc.date }}</td>

              <td>
                <span
                  class="status-badge"
                  :class="doc.statut === 'Analysé' ? 'success' : 'pending'"
                >
                  {{ doc.statut }}
                </span>
              </td>

              <td>
                <div class="actions">
                  <button class="view-btn" @click="consulterDocument(doc)">
                    Voir
                  </button>
                  <button class="delete-btn" @click="supprimerDocument(doc.id)">
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="documentsFiltres.length === 0">
              <td colspan="6" class="empty-state">
                Aucun document trouvé.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p class="demo-note">
      Mode démonstration : les documents sont conservés uniquement
      dans la mémoire de la page. Ils disparaissent au rechargement.
    </p>
  </div>
</template>

<style scoped>
.documents-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #24313b;
}

.page-header, .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 700;
}

.page-header p, .section-header p {
  color: #82909b;
  font-size: 14px;
  margin-top: 5px;
}

.btn-primary {
  background: #b76b43;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:hover {
  background: #975331;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.stat-card, .documents-card {
  background: white;
  border: 1px solid #e7eaed;
  border-radius: 15px;
  padding: 22px;
  box-shadow: 0 3px 14px rgba(0,0,0,.025);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-card span {
  color: #71808b;
  font-size: 14px;
}

.stat-card strong {
  font-size: 30px;
  font-weight: 700;
}

.stat-card small {
  color: #9aa4ad;
}

.section-header {
  margin-bottom: 22px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.search-input, .filter-select {
  padding: 10px 13px;
  border: 1px solid #dce2e7;
  border-radius: 9px;
  background: white;
  outline: none;
}

.search-input:focus, .filter-select:focus {
  border-color: #b76b43;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 850px;
  text-align: left;
}

th {
  background: #f8f9fa;
  color: #77838e;
  font-size: 12px;
  font-weight: 600;
  padding: 15px;
}

td {
  padding: 17px 15px;
  border-bottom: 1px solid #eef0f2;
  font-size: 13px;
  color: #56636d;
}

.file-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-cell strong {
  display: block;
  color: #27333d;
  font-weight: 600;
}

.file-cell small {
  color: #9aa4ad;
  display: block;
  margin-top: 4px;
}

.file-icon {
  width: 42px;
  height: 44px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}

.file-icon.pdf {
  color: #c55d49;
  background: #fcece8;
}

.file-icon.word {
  color: #467db7;
  background: #e8f1fb;
}

.file-icon.excel {
  color: #36865b;
  background: #e5f5ea;
}

.status-badge {
  display: inline-block;
  padding: 6px 11px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.success {
  color: #24875a;
  background: #e5f6ec;
}

.status-badge.pending {
  color: #a87719;
  background: #fff4d9;
}

.actions {
  display: flex;
  gap: 8px;
}

.actions button {
  padding: 7px 11px;
  border-radius: 7px;
  font-size: 12px;
  cursor: pointer;
}

.view-btn {
  color: #467db7;
  background: #eaf2fb;
}

.delete-btn {
  color: #bd4e4e;
  background: #fceaea;
}

.empty-state {
  text-align: center;
  padding: 35px;
  color: #9aa4ad;
}

.demo-note {
  font-size: 12px;
  color: #9aa4ad;
}

@media (max-width: 1000px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 550px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .btn-primary {
    width: 100%;
  }

  .search-input {
    width: 100%;
  }
}
</style>
