import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  { path: '/', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { label: 'Tableau de bord' } },
  { path: '/documents', name: 'documents', component: () => import('../views/DocumentsView.vue'), meta: { label: 'Documents' } },
  { path: '/chat', name: 'chat', component: () => import('../views/ChatView.vue'), meta: { label: 'Assistant IA' } },
  { path: '/historique', name: 'history', component: () => import('../views/HistoryView.vue'), meta: { label: 'Historique' } },
  { path: '/analyse', name: 'analysis', component: () => import('../views/AnalysisView.vue'), meta: { label: 'Analyse documentaire' } },
  { path: '/parametres', name: 'settings', component: () => import('../views/SettingsView.vue'), meta: { label: 'Paramètres' } },
]

export default createRouter({ history: createWebHistory(), routes })
