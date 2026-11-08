
<script setup>
import { computed, onMounted, ref } from 'vue'
import { getHealth } from '../services/api'

// Données de démonstration
const stats = [
  { label: 'Documents importés', value: 248, change: '+12 %', icon: '▤', color: 'orange' },
  { label: 'Questions à l’IA', value: 1432, change: '+24 %', icon: '✦', color: 'blue' },
  { label: 'Analyses réalisées', value: 186, change: '+8 %', icon: '◈', color: 'purple' },
  { label: 'Réponses utiles', value: '94 %', change: '+3 pts', icon: '✓', color: 'green' },
]

const months = ['Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.']
const documentsByMonth = [24, 38, 31, 53, 46, 56]
const questionsByMonth = [110, 155, 142, 220, 315, 490]

const types = [
  { name: 'PDF', count: 149, color: '#c16a35' },
  { name: 'Word', count: 62, color: '#4c86b6' },
  { name: 'Excel', count: 37, color: '#54a58a' },
]

const totalDocuments = types.reduce((sum, type) => sum + type.count, 0)

const pieBackground = computed(() => {
  let current = 0
  const stops = types.map(type => {
    const start = current
    current += (type.count / totalDocuments) * 100
    return `${type.color} ${start}% ${current}%`
  })
  return `conic-gradient(${stops.join(', ')})`
})

const linePoints = computed(() =>
  questionsByMonth.map((value, index) => ({
    x: 40 + index * 88,
    y: 205 - (value / 550) * 170,
    value,
  }))
)

const linePath = computed(() =>
  linePoints.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')
)

const areaPath = computed(() =>
  `${linePath.value} L 480 205 L 40 205 Z`
)

const status = ref('vérification…')

onMounted(async () => {
  try {
    status.value = (await getHealth()).status
  } catch {
    status.value = 'injoignable'
  }
})
</script>

<template>
  <div class="dashboard space-y-6">

    <!-- TITRE -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm text-ink-500">
          Vue d’ensemble de l’activité documentaire et IA
        </p>
        <h2 class="mt-1 text-xl font-semibold text-ink-900">
          Bienvenue sur COSIDER AI
        </h2>
      </div>
      <span class="demo-tag">● Données de démonstration</span>
    </div>

    <!-- CARTES STATISTIQUES -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="stat in stats"
        :key="stat.label"
        class="metric-card"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm text-ink-500">{{ stat.label }}</span>
          <span class="metric-icon" :class="stat.color">
            {{ stat.icon }}
          </span>
        </div>

        <div class="mt-3 text-3xl font-bold tracking-tight text-ink-900">
          {{ typeof stat.value === 'number'
            ? stat.value.toLocaleString('fr-FR')
            : stat.value }}
        </div>

        <p class="mt-2 text-xs text-ink-500">
          <span class="font-semibold text-emerald-700">
            {{ stat.change }}
          </span>
          par rapport au mois précédent
        </p>
      </article>
    </div>

    <!-- GRAPHIQUE EN BARRES -->
    <div class="grid gap-5 xl:grid-cols-5">
      <section class="chart-card xl:col-span-3">
        <div class="mb-6">
          <h3 class="text-lg font-semibold">Documents analysés</h3>
          <p class="text-sm text-ink-500">
            Volume mensuel de documents traités
          </p>
        </div>

        <div class="bar-chart">
          <div
            v-for="(count, index) in documentsByMonth"
            :key="months[index]"
            class="bar-column"
          >
            <span class="bar-value">{{ count }}</span>
            <div class="bar-track">
              <div
                class="bar-fill"
                :style="{ height: `${count / 60 * 100}%` }"
              ></div>
            </div>
            <span class="bar-label">{{ months[index] }}</span>
          </div>
        </div>
      </section>

      <!-- GRAPHIQUE CIRCULAIRE -->
      <section class="chart-card xl:col-span-2">
        <h3 class="text-lg font-semibold">Types de documents</h3>
        <p class="text-sm text-ink-500">
          Répartition des fichiers importés
        </p>

        <div class="flex flex-col items-center gap-6 py-7 sm:flex-row xl:flex-col 2xl:flex-row">
          <div class="donut" :style="{ background: pieBackground }">
            <div class="donut-center">
              <strong>{{ totalDocuments }}</strong>
              <span>documents</span>
            </div>
          </div>

          <div class="w-full flex-1 space-y-3">
            <div
              v-for="type in types"
              :key="type.name"
              class="flex items-center justify-between gap-4 text-sm"
            >
              <span class="flex items-center gap-2">
                <i
                  class="legend-dot"
                  :style="{ background: type.color }"
                ></i>
                {{ type.name }}
              </span>
              <span class="font-semibold">
                {{ Math.round(type.count / totalDocuments * 100) }} %
                <span class="font-normal text-ink-500">
                  ({{ type.count }})
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ACTIVITÉ IA -->
    <div class="grid gap-5 xl:grid-cols-5">
      <section class="chart-card xl:col-span-3">
        <h3 class="text-lg font-semibold">
          Activité de l’assistant IA
        </h3>
        <p class="text-sm text-ink-500">
          Nombre de questions posées par mois
        </p>

        <svg class="mt-5 w-full" viewBox="0 0 520 250">
          <defs>
            <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#c16a35" stop-opacity=".24"/>
              <stop offset="100%" stop-color="#c16a35" stop-opacity="0"/>
            </linearGradient>
          </defs>

          <g v-for="n in 4" :key="n">
            <line
              x1="40"
              :y1="205 - n * 42.5"
              x2="480"
              :y2="205 - n * 42.5"
              stroke="#e8edf0"
              stroke-dasharray="4 5"
            />
            <text
              x="30"
              :y="209 - n * 42.5"
              font-size="11"
              fill="#7a8792"
              text-anchor="end"
            >{{ n * 125 }}</text>
          </g>

          <path :d="areaPath" fill="url(#activityFill)"/>
          <path
            :d="linePath"
            fill="none"
            stroke="#c16a35"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />

          <g v-for="(point, index) in linePoints" :key="index">
            <circle
              :cx="point.x"
              :cy="point.y"
              r="5"
              fill="white"
              stroke="#c16a35"
              stroke-width="3"
            />
            <text
              :x="point.x"
              y="230"
              text-anchor="middle"
              font-size="12"
              fill="#667684"
            >{{ months[index] }}</text>
          </g>
        </svg>
      </section>

      <!-- ÉTAT DU SERVEUR -->
      <section class="chart-card xl:col-span-2">
        <h3 class="text-lg font-semibold">État du système</h3>
        <p class="text-sm text-ink-500">
          Connexion entre l’interface et le serveur
        </p>

        <div class="mt-7 rounded-xl bg-ink-50 p-5">
          <div class="flex items-center gap-3">
            <span
              class="h-3 w-3 rounded-full"
              :class="status === 'ok'
                ? 'bg-emerald-500'
                : status === 'vérification…'
                  ? 'bg-amber-400'
                  : 'bg-red-500'"
            ></span>
            <span class="font-semibold">Backend FastAPI</span>
          </div>

          <p class="mt-2 text-sm text-ink-500">
            {{ status === 'ok'
              ? 'Serveur connecté et opérationnel'
              : status === 'vérification…'
                ? 'Vérification de la connexion…'
                : 'Serveur inaccessible : vérifie que FastAPI est lancé' }}
          </p>

          <p class="mt-4 text-xs text-ink-500">
            Point de contrôle : /api/health
          </p>
        </div>

        <p class="mt-5 text-sm leading-6 text-ink-500">
          Les graphiques utilisent actuellement des valeurs fictives.
          Les futures API permettront d’afficher les statistiques réelles.
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.dashboard { color: #14202b; }

.metric-card, .chart-card {
  background: #fff;
  border: 1px solid #e5e9ed;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 18px rgba(20,32,43,.035);
}

.demo-tag {
  background: #fbe9dd;
  color: #9d4b1d;
  font-size: 12px;
  font-weight: 600;
  border-radius: 100px;
  padding: 8px 12px;
}

.metric-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  font-size: 20px;
  font-weight: 700;
}
.metric-icon.orange { background: #fbe9dd; color: #b4521c; }
.metric-icon.blue { background: #e7f1fa; color: #4c86b6; }
.metric-icon.purple { background: #f0eafa; color: #8c65bf; }
.metric-icon.green { background: #e6f5ee; color: #39966c; }

.bar-chart {
  height: 245px;
  display: flex;
  gap: clamp(8px, 2vw, 28px);
  justify-content: space-around;
  align-items: stretch;
}
.bar-column {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: center;
}
.bar-value {
  height: 24px;
  font-size: 12px;
  font-weight: 700;
  color: #5b6b7a;
}
.bar-track {
  width: 100%;
  max-width: 56px;
  height: 185px;
  display: flex;
  align-items: flex-end;
  background: #f7f8fa;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}
.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #dc9568, #b4521c);
  border-radius: 8px 8px 0 0;
  transition: height .3s ease;
}
.bar-label {
  padding-top: 10px;
  font-size: 12px;
  color: #5b6b7a;
  white-space: nowrap;
}

.donut {
  width: 176px;
  height: 176px;
  flex-shrink: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.donut-center {
  width: 118px;
  height: 118px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.donut-center strong { font-size: 30px; line-height: 1.1; }
.donut-center span { font-size: 12px; color: #5b6b7a; }

.legend-dot {
  width: 10px;
  height: 10px;
  display: inline-block;
  border-radius: 50%;
}

@media (max-width: 420px) {
  .metric-card, .chart-card { padding: 16px; }
  .bar-label { font-size: 10px; }
}
</style>
