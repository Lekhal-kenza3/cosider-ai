
import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
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
    path: '/analysis',
    name: 'analysis',
    component: () => import('../views/AnalysisView.vue'),
    meta: { label: 'Analyse documentaire' }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('../views/HistoryView.vue'),
    meta: { label: 'Historique' }
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    component: () => import('../views/WarehouseView.vue'),
    meta: { label: 'Entrepôt de données' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue'),
    meta: { label: 'Paramètres' }
  },

  // Compatibilité avec les anciens liens
  { path: '/analyse', redirect: '/analysis' },
  { path: '/historique', redirect: '/history' },
  { path: '/parametres', redirect: '/settings' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
