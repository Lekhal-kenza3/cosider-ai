
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { label: 'Tableau de bord' }
  },
  {
    path: '/documents',
    name: 'documents',
    component: () => import('../views/DocumentsView.vue'),
    meta: { label: 'Documents' }
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('../views/ChatView.vue'),
    meta: { label: 'Assistant IA' }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue'),
    meta: { label: 'Historique' }
  },
  {
    path: '/analysis',
    name: 'analysis',
    component: () => import('../views/AnalysisView.vue'),
    meta: { label: 'Analyse documentaire' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { label: 'Paramètres' }
  },

  // Compatibilité avec les anciennes adresses
  { path: '/historique', redirect: '/history' },
  { path: '/analyse', redirect: '/analysis' },
  { path: '/parametres', redirect: '/settings' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
