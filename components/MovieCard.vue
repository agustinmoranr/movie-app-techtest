<script setup lang="ts">
  const props = defineProps<{
    src: string
    mobileSrc?: string
    title: string
    overview: string
    id: number
    onIntersecting?: Function
  }>()
  const movieCard = ref(null);
  import LazyImage from '@/components/LazyImage.vue';
  const currentPath = location.href
  
  onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if(typeof props.onIntersecting === "function") props.onIntersecting(movieCard.value);
           // Ejecutar el callback proporcionado a través de props
          observer.unobserve(entry.target); // Dejar de observar una vez que se haya detectado la intersección
        }
      });
    });

    if(movieCard.value) {
      observer.observe(movieCard.value);
    }
    onBeforeUnmount(() => {
      observer.disconnect();
    });
  });
</script>

<template>
  <article  
    ref="movieCard"
    class="relative bg-accent text-text-primary rounded-lg overflow-hidden"
  > 
    <div class="hidden sm:block">
      <LazyImage class="w-full" :src="src" :alt="`Imagen de la película ${title}`" :title="title" />
      <div class="p-4">
        <div class="mb-4">
          <h3 class="text-xl text-center font-bold mb-2">{{title}}</h3>
          <p v-if="overview" class="text-sm line-clamp-4">{{overview}}</p>
          <span v-else class="text-sm line-clamp-4">Sin sinopsis en español.</span>
        </div>
        <NuxtLink class="ml-auto " :to="`movieDetail/${id}`" :title="`${currentPath}movieDetail/${id}`">
          <span class="bg-primary-button p-2 w-full uppercase text-center block">MOSTRAR DETALLE</span>
        </NuxtLink>
      </div>
    </div>
    <NuxtLink :to="`movieDetail/${id}`" class="block sm:hidden">
      <LazyImage class="w-full" :src="mobileSrc ?? src" :alt="`Imagen de la película ${title}`" :title="`${currentPath}movieDetail/${id}`" />
    </NuxtLink>
  </article>
</template>

<style>
</style>