<script setup lang="ts">
  defineProps<{
    src: string
    title: string
    overview: string
    id: number
  }>()
</script>

<template>
  <article  
    class="relative bg-accent text-text-primary rounded-lg overflow-hidden"
  >
    <img class="w-full" :src="src" />
    <div class="p-4">
      <div class="mb-4">
        <h3 class="text-xl font-bold mb-2">{{title}}</h3>
        <p v-if="overview" class="text-sm line-clamp-4">{{overview}}</p>
        <span v-else class="text-sm line-clamp-4">Sin sinopsis en español.</span>
      </div>
      <NuxtLink class="ml-auto " :to="`movieDetail/${id}`">
        <button class="bg-primary-button p-2 w-full">MOSTRAR DETALLE</button>
      </NuxtLink>
    </div>
  </article>
</template>

<style>
</style>