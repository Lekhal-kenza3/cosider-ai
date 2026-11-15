
<script setup>
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuOuvert = ref(false)
const menuPrincipalMasque = ref(false)
const recherche = ref('')

function basculerMenu() {
  if (window.innerWidth <= 900) {
    menuOuvert.value = !menuOuvert.value
  } else {
    menuPrincipalMasque.value = !menuPrincipalMasque.value
  }
}

function fermerMenu() {
  menuOuvert.value = false
}

const navigation = [
  { nom: 'Tableau de bord', chemin: '/', icone: 'home' },
  { nom: 'Documents', chemin: '/documents', icone: 'file' },
  { nom: 'Assistant IA', chemin: '/chat', icone: 'chat' },
  { nom: 'Analyse documentaire', chemin: '/analysis', icone: 'chart' },
  { nom: 'Historique', chemin: '/history', icone: 'history' },
  { nom: 'Entrepôt de données', chemin: '/warehouse', icone: 'database' },
  { nom: 'Paramètres', chemin: '/settings', icone: 'settings' }
]

const titrePage = computed(() => {
  return navigation.find(item => item.chemin === route.path)?.nom
    || 'COSIDER AI'
})

function lancerRecherche() {
  const texte = recherche.value.trim()
  if (!texte) return

  router.push({
    path: '/documents',
    query: { search: texte }
  })

  fermerMenu()
}

function ouvrirNotifications() {
  window.alert('Aucune nouvelle notification pour le moment.')
}

function ouvrirAide() {
  window.alert(
    'COSIDER AI : utilisez le menu pour accéder aux documents, aux analyses et à votre assistant.'
  )
}
</script>

<template>
  <div class="cosider-app">

    <!-- FOND MOBILE -->
    <div
      v-if="menuOuvert"
      class="mobile-overlay"
      @click="fermerMenu"
    ></div>

    <!-- MENU PRINCIPAL COSIDER -->
    <aside
      class="sidebar"
      :class="{
        'sidebar-open': menuOuvert,
        'sidebar-hidden': menuPrincipalMasque
      }"
    >

      <!-- LOGO COSIDER -->
      <div class="logo-section">
        <RouterLink to="/" @click="fermerMenu">
          <img
            src="/images/logo-cosider.png"
            alt="Logo COSIDER Construction"
            class="cosider-logo"
          />
        </RouterLink>

        <p class="logo-subtitle">
          PLATEFORME INTELLIGENTE
        </p>
      </div>

      <!-- NAVIGATION -->
      <nav class="navigation" aria-label="Navigation principale">

        <RouterLink
          v-for="item in navigation"
          :key="item.chemin"
          :to="item.chemin"
          class="nav-link"
          :class="{ active: route.path === item.chemin }"
          @click="fermerMenu"
        >

          <span class="nav-icon">

            <!-- TABLEAU DE BORD -->
            <svg
              v-if="item.icone === 'home'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="m3 10 9-7 9 7"/>
              <path d="M5 9v12h14V9M9 21v-8h6v8"/>
            </svg>

            <!-- DOCUMENTS -->
            <svg
              v-else-if="item.icone === 'file'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M6 2h8l5 5v14H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/>
              <path d="M14 2v6h5M8 13h8M8 17h8"/>
            </svg>

            <!-- ASSISTANT IA -->
            <svg
              v-else-if="item.icone === 'chat'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M20 11.5a8 8 0 0 1-8 8 9 9 0 0 1-4-.9L3 21l1.9-4.5A8 8 0 1 1 20 11.5Z"/>
              <path d="M9 12h6M12 9v6"/>
            </svg>

            <!-- ANALYSE -->
            <svg
              v-else-if="item.icone === 'chart'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 21h18M6 18v-6M12 18V5M18 18v-9"/>
              <path d="m15 6 3-3 3 3"/>
            </svg>

            <!-- HISTORIQUE -->
            <svg
              v-else-if="item.icone === 'history'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 12a9 9 0 1 0 3-7"/>
              <path d="M3 4v5h5M12 7v5l3 2"/>
            </svg>

            <!-- ENTREPÔT -->
            <svg
              v-else-if="item.icone === 'database'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/>
              <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>
            </svg>

            <!-- PARAMÈTRES -->
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>
            </svg>

          </span>

          <span>{{ item.nom }}</span>

        </RouterLink>
      </nav>

      <!-- DÉCORATION -->
      <div class="sidebar-decoration">
        <svg viewBox="0 0 260 200" preserveAspectRatio="none">
          <g fill="#e9eaec">
            <path d="M18 140 58 113v87H18Z"/>
            <path d="M68 115 112 78v122H68Z"/>
            <path d="M121 94 162 49v151h-41Z"/>
            <path d="M172 74 210 22v178h-38Z"/>
          </g>

          <g stroke="#fff" stroke-width="3" opacity=".7">
            <path d="M36 150v40M51 137v53M85 128v62M101 114v76M140 110v80M155 93v97M190 90v100"/>
          </g>

          <path
            d="M0 184 Q90 188 160 145 T260 130 V200 H0Z"
            fill="#d90020"
          />
        </svg>
      </div>

    </aside>

    <!-- PARTIE PRINCIPALE -->
    <div class="main-area">

      <!-- BARRE DU HAUT -->
      <header class="topbar">

        <div class="topbar-brand">

          <!-- BOUTON POUR MASQUER / AFFICHER LE MENU -->
          <button
            class="menu-button"
            type="button"
            :aria-label="
              menuPrincipalMasque
                ? 'Afficher le menu principal'
                : 'Masquer le menu principal'
            "
            :aria-expanded="!menuPrincipalMasque"
            @click="basculerMenu"
          >
            <svg
              v-if="!menuPrincipalMasque"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <rect x="3" y="4" width="18" height="16" rx="2"/>
              <path d="M9 4v16"/>
              <path d="m16 9-3 3 3 3"/>
            </svg>

            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <rect x="3" y="4" width="18" height="16" rx="2"/>
              <path d="M9 4v16"/>
              <path d="m13 9 3 3-3 3"/>
            </svg>
          </button>

          <strong>COSIDER AI</strong>
        </div>

        <!-- RECHERCHE -->
        <form
          class="search-box"
          @submit.prevent="lancerRecherche"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="7"/>
            <path d="m16 16 5 5"/>
          </svg>

          <input
            v-model="recherche"
            type="search"
            placeholder="Rechercher un document, une analyse..."
            aria-label="Rechercher"
          />

          <button
            type="submit"
            class="search-submit"
            aria-label="Lancer la recherche"
          >
            ↵
          </button>
        </form>

        <!-- NOTIFICATIONS ET PROFIL -->
        <div class="topbar-actions">

          <button
            type="button"
            class="icon-button notification-button"
            aria-label="Notifications"
            @click="ouvrirNotifications"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/>
              <path d="M10 21h4"/>
            </svg>

            <span class="notification-dot"></span>
          </button>

          <button
            type="button"
            class="icon-button help-button"
            aria-label="Aide"
            @click="ouvrirAide"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="12" cy="12" r="9"/>
              <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01"/>
            </svg>
          </button>

          <div class="topbar-divider"></div>

          <RouterLink
            to="/settings"
            class="user-profile"
          >
            <div class="avatar">C</div>

            <div class="user-details">
              <strong>Mon espace</strong>
              <small>Administrateur</small>
            </div>

            <span class="profile-chevron">⌄</span>
          </RouterLink>

        </div>
      </header>

      <!-- CONTENU DES PAGES -->
      <main class="page-content">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<style scoped>
/* STRUCTURE PRINCIPALE */
.cosider-app {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f7f8fa;
  color: #17191e;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
}

/* MENU LATÉRAL */
.sidebar {
  position: sticky;
  top: 0;
  width: 268px;
  min-width: 268px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e9e9ed;
  display: flex;
  flex-direction: column;
  z-index: 50;
  overflow: hidden;
  transition:
    width 0.3s ease,
    min-width 0.3s ease,
    opacity 0.3s ease;
}

/* MASQUER LE MENU SUR ORDINATEUR */
@media (min-width: 901px) {
  .sidebar.sidebar-hidden {
    width: 0;
    min-width: 0;
    opacity: 0;
    border-right: none;
    pointer-events: none;
  }
}

/* LOGO */
.logo-section {
  height: 145px;
  min-height: 145px;
  padding: 18px 15px 22px;
  border-bottom: 1px solid #f0f0f2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-section a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.cosider-logo {
  max-width: 175px;
  width: 100%;
  max-height: 57px;
  object-fit: contain;
}

.logo-subtitle {
  margin: 10px 0 0;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.4px;
  color: #b51226;
  text-align: center;
  white-space: nowrap;
}

/* NAVIGATION */
.navigation {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 16px;
  position: relative;
  z-index: 2;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 48px;
  padding: 0 16px;
  border-radius: 10px;
  color: #22252c;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  transition: background .2s, color .2s;
  white-space: nowrap;
}

.nav-link:hover {
  background: #fff1f3;
  color: #bd0020;
}

.nav-link.active {
  color: white;
  background: linear-gradient(90deg, #c9001c, #e00020);
  box-shadow: 0 4px 9px #c9001c2a;
}

.nav-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* DÉCORATION DU MENU */
.sidebar-decoration {
  margin-top: auto;
  width: 100%;
  height: 190px;
  overflow: hidden;
  pointer-events: none;
}

.sidebar-decoration svg {
  width: 100%;
  height: 100%;
}

/* ZONE PRINCIPALE */
.main-area {
  flex: 1;
  min-width: 0;
  width: 0;
  transition: width 0.3s ease;
}

/* BARRE SUPÉRIEURE */
.topbar {
  height: 70px;
  background: #ffffff;
  border-bottom: 1px solid #e9e9ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 0 30px;
  position: sticky;
  top: 0;
  z-index: 20;
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
}

.topbar-brand strong {
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.6px;
}

/* BOUTON OUVRIR / FERMER */
.menu-button {
  width: 39px;
  height: 39px;
  display: grid;
  place-items: center;
  background: #ffffff;
  border: 1px solid #e7e8ec;
  border-radius: 10px;
  cursor: pointer;
  color: #17191e;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.menu-button svg {
  width: 23px;
  height: 23px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.menu-button:hover {
  background: #fff0f3;
  color: #c90023;
  border-color: #f1b9c3;
}

/* RECHERCHE */
.search-box {
  flex: 1;
  max-width: 530px;
  height: 39px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e0e2e8;
  background: #fafbfc;
  border-radius: 22px;
  padding: 0 12px;
}

.search-box:focus-within {
  border-color: #c9001c;
}

.search-box svg {
  width: 19px;
  height: 19px;
  flex-shrink: 0;
}

.search-box input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: #222;
}

.search-submit {
  border: 0;
  background: #f0f1f5;
  border-radius: 5px;
  color: #64748b;
  cursor: pointer;
  padding: 2px 8px;
}

/* ACTIONS */
.topbar-actions {
  display: flex;
  align-items: center;
  gap: 19px;
}

.icon-button {
  position: relative;
  border: 0;
  background: transparent;
  width: 27px;
  height: 30px;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.icon-button svg {
  width: 23px;
  height: 23px;
}

.notification-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #d60020;
  border-radius: 50%;
  right: 0;
  top: 1px;
}

.topbar-divider {
  width: 1px;
  height: 30px;
  background: #e5e7eb;
}

/* PROFIL */
.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  white-space: nowrap;
}

.avatar {
  width: 39px;
  height: 39px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #46404a;
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.user-details strong {
  font-size: 12px;
  font-weight: 800;
}

.user-details small {
  color: #7d818b;
  font-size: 10px;
}

.profile-chevron {
  font-size: 20px;
  margin-left: 10px;
}

/* CONTENU */
.page-content {
  padding: 24px;
  max-width: 1750px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

/* MOBILE */
.mobile-overlay {
  display: none;
}

@media (max-width: 1200px) {
  .sidebar {
    width: 240px;
    min-width: 240px;
  }

  .topbar {
    gap: 14px;
    padding: 0 20px;
  }

  .topbar-actions {
    gap: 12px;
  }
}

@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    left: 0;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    width: 268px;
    min-width: 268px;
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: #0007;
    z-index: 40;
  }

  .main-area {
    width: 100%;
  }

  .search-box {
    max-width: 330px;
  }
}

@media (max-width: 650px) {
  .topbar {
    height: 65px;
    padding: 0 13px;
  }

  .topbar-brand {
    gap: 9px;
  }

  .topbar-brand strong {
    font-size: 15px;
  }

  .search-box {
    display: none;
  }

  .help-button,
  .topbar-divider,
  .user-details,
  .profile-chevron {
    display: none;
  }

  .page-content {
    padding: 16px;
  }

  .sidebar-decoration {
    height: 150px;
  }
}
</style>
