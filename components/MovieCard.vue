<script setup lang="ts">
  // const props = defineProps({
  //   id: Number,
  //   src: String,
  //   title: String,
  //   overview: String,
  //   onIntersecting: Function,
  // })
  const props = defineProps<{
    src: string
    title: string
    overview: string
    id: number
    onIntersecting?: Function 
  }>()
  const movieCard = ref(null);
  
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