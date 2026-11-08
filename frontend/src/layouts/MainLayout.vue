<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { routes } from '../router'

const open = ref(false)
const route = useRoute()
</script>

<template>
  <div class="min-h-screen lg:flex">
    <header class="flex items-center justify-between bg-ink-900 px-4 py-3 text-white lg:hidden">
      <span class="font-semibold">COSIDER AI</span>
      <button class="rounded px-2 py-1 hover:bg-ink-700" aria-label="Menu" @click="open = !open">☰</button>
    </header>

    <aside
      :class="open ? 'block' : 'hidden'"
      class="w-full shrink-0 bg-ink-900 text-ink-100 lg:block lg:min-h-screen lg:w-64"
    >
      <div class="hidden px-6 py-6 text-lg font-semibold tracking-tight lg:block">COSIDER AI</div>
      <nav class="space-y-1 px-3 pb-4">
        <RouterLink
          v-for="r in routes"
          :key="r.name"
          :to="r.path"
          class="block rounded-md px-3 py-2 text-sm hover:bg-ink-700"
          active-class="bg-brand-600 text-white hover:bg-brand-600"
          @click="open = false"
        >
          {{ r.meta.label }}
        </RouterLink>
      </nav>
    </aside>

    <main class="flex-1 p-6 lg:p-10">
      <h1 class="mb-6 text-2xl font-semibold">{{ route.meta.label }}</h1>
      <RouterView />
    </main>
  </div>
</template>
