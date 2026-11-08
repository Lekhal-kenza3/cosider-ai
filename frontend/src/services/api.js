/** Client HTTP minimal vers l'API FastAPI. */
const BASE = '/api'

export async function api(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) throw new Error(`Erreur ${res.status}`)
  return res.json()
}

export const getHealth = () => api('/health')
