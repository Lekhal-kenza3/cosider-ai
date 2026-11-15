
<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const menuOuvert = ref(false)

const navigation = [
  { nom: 'Tableau de bord', chemin: '/', icone: 'dashboard' },
  { nom: 'Documents', chemin: '/documents', icone: 'documents' },
  { nom: 'Assistant IA', chemin: '/chat', icone: 'chat' },
  { nom: 'Analyse documentaire', chemin: '/analysis', icone: 'analysis' },
  { nom: 'Historique', chemin: '/history', icone: 'history' },
  { nom: 'Paramètres', chemin: '/settings', icone: 'settings' }
]

function fermerMenu() {
  menuOuvert.value = false
}
</script>

<template>
  <div class="app-shell">
    <div
      v-if="menuOuvert"
      class="mobile-overlay"
      @click="fermerMenu"
    ></div>

    <aside class="sidebar" :class="{ 'sidebar-open': menuOuvert }">
      <div class="brand">
        <div class="brand-symbol">C<span>.</span></div>

        <div class="brand-text">
          <strong>COSIDER <span>AI</span></strong>
          <small>DOCUMENT INTELLIGENCE</small>
        </div>
      </div>

      <div class="workspace-label">ESPACE DE TRAVAIL</div>

      <nav class="navigation">
        <RouterLink
          v-for="item in navigation"
          :key="item.chemin"
          :to="item.chemin"
          class="nav-link"
          active-class="nav-active"
          exact-active-class="nav-active"
          @click="fermerMenu"
        >
          <span class="nav-icon">
            <svg
              v-if="item.icone === 'dashboard'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>

            <svg
              v-else-if="item.icone === 'documents'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/>
              <path d="M14 3v6h5M9 13h6M9 17h6"/>
            </svg>

            <svg
              v-else-if="item.icone === 'chat'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-4.5A8.5 8.5 0 1 1 20 11.5Z"/>
              <path d="m12 7-1 3.5L7.5 12l3.5 1.5L12 17l1-3.5 3.5-1.5-3.5-1.5L12 7Z"/>
            </svg>

            <svg
              v-else-if="item.icone === 'analysis'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>
              <path d="m15 7 2 2 4-4"/>
            </svg>

            <svg
              v-else-if="item.icone === 'history'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/>
              <path d="M3 3v5h5M12 7v5l3 2"/>
            </svg>

            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2 2-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21h-3v-.9a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2-2 .1-.1A1.7 1.7 0 0 0 7.2 15a1.7 1.7 0 0 0-1.5-1H5v-3h.7a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 2-2 .1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5V4h3v.9a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2 2-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.7v3h-.7a1.7 1.7 0 0 0-1.5 1Z"/>
            </svg>
          </span>

          <span>{{ item.nom }}</span>
          <span class="nav-arrow">›</span>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <div class="ai-status">
          <span class="status-dot"></span>
          <div>
            <strong>Espace IA</strong>
            <small>Plateforme documentaire</small>
          </div>
        </div>

        <div class="sidebar-footer">
          COSIDER AI <span>•</span> Version 1.0
        </div>
      </div>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="mobile-menu-btn"
            aria-label="Ouvrir le menu"
            @click="menuOuvert = true"
          >
            ☰
          </button>

          <div class="breadcrumb">
            <span class="breadcrumb-home">Workspace</span>
            <span class="breadcrumb-separator">/</span>
            <strong>COSIDER AI</strong>
          </div>
        </div>

        <div class="topbar-right">
          <span class="topbar-tag">
            <span class="tag-dot"></span>
            Document Intelligence
          </span>

          <div class="topbar-divider"></div>

          <div class="profile">
            <div class="profile-avatar">C</div>
            <div class="profile-info">
              <strong>Mon espace</strong>
              <small>Utilisateur</small>
            </div>
          </div>
        </div>
      </header>

      <main class="page-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  color: #202634;
}

.sidebar {
  width: 270px;
  min-width: 270px;
  min-height: 100vh;
  background: #ffffff;
  border-right: 1px solid #ebedf2;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 30;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 32px 23px 37px;
}

.brand-symbol {
  width: 48px;
  height: 48px;
  background: linear-gradient(145deg, #d71e37, #990e20);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'Manrope', sans-serif;
  font-size: 28px;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(181, 18, 38, 0.18);
}

.brand-symbol span {
  color: #ffb5c0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.brand-text strong {
  font-family: 'Manrope', sans-serif;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.8px;
}

.brand-text strong span {
  color: #b51226;
}

.brand-text small {
  color: #9299a6;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.workspace-label {
  padding: 0 28px;
  color: #9ba2ae;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
  margin-bottom: 17px;
}

.navigation {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 0 13px;
}

.nav-link {
  min-height: 49px;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 0 14px;
  border-radius: 12px;
  color: #737b8b;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: #fff5f6;
  color: #b51226;
}

.nav-active,
.nav-active:hover {
  color: #b51226;
  background: #fff0f2;
}

.nav-icon {
  width: 21px;
  height: 21px;
  flex-shrink: 0;
}

.nav-icon svg {
  width: 100%;
  height: 100%;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.nav-arrow {
  margin-left: auto;
  font-size: 20px;
  opacity: 0;
}

.nav-active .nav-arrow,
.nav-link:hover .nav-arrow {
  opacity: 1;
}

.sidebar-bottom {
  margin-top: auto;
  padding: 20px 16px 23px;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fb;
  border: 1px solid #eff0f4;
  border-radius: 14px;
}

.status-dot,
.tag-dot {
  width: 9px;
  height: 9px;
  background: #20b779;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(32, 183, 121, 0.12);
  flex-shrink: 0;
}

.ai-status div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ai-status strong {
  font-size: 12px;
}

.ai-status small {
  font-size: 10px;
  color: #8992a0;
}

.sidebar-footer {
  margin-top: 21px;
  text-align: center;
  font-size: 10px;
  color: #a0a6b1;
}

.sidebar-footer span {
  color: #b51226;
  margin: 0 5px;
}

.main-area {
  flex: 1;
  min-width: 0;
}

.topbar {
  height: 82px;
  background: rgba(255, 255, 255, 0.94);
  border-bottom: 1px solid #ebedf2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 37px;
}

.topbar-left,
.topbar-right,
.profile,
.breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb {
  gap: 12px;
  font-size: 12px;
}

.breadcrumb-home {
  color: #969eac;
}

.breadcrumb-separator {
  color: #c6cbd4;
}

.breadcrumb strong {
  font-weight: 800;
}

.topbar-right {
  gap: 23px;
}

.topbar-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  color: #626c7d;
  background: #f6f8fa;
  padding: 10px 14px;
  border-radius: 9px;
}

.tag-dot {
  width: 7px;
  height: 7px;
  box-shadow: none;
}

.topbar-divider {
  width: 1px;
  height: 28px;
  background: #e8eaf0;
}

.profile {
  gap: 11px;
}

.profile-avatar {
  width: 39px;
  height: 39px;
  border-radius: 12px;
  background: #fff0f2;
  color: #b51226;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.profile-info strong {
  font-size: 12px;
}

.profile-info small {
  font-size: 10px;
  color: #9299a6;
}

.page-content {
  padding: 34px 38px 60px;
  max-width: 1700px;
  margin: 0 auto;
}

.mobile-menu-btn {
  display: none;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #b51226;
}

.mobile-overlay {
  display: none;
}

@media (max-width: 1100px) {
  .sidebar {
    width: 235px;
    min-width: 235px;
  }

  .page-content {
    padding: 28px 24px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    width: 270px;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .sidebar-open {
    transform: translateX(0);
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    z-index: 20;
  }

  .mobile-menu-btn {
    display: block;
  }

  .topbar {
    height: 70px;
    padding: 0 20px;
  }

  .topbar-tag,
  .topbar-divider,
  .profile-info {
    display: none;
  }

  .page-content {
    padding: 24px 16px;
  }
}
</style>
