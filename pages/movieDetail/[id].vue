<script setup>
  const route = useRoute()
  const router = useRouter()
  const page = ref(1)
  const config = useRuntimeConfig();
  const [{data: movieDBConfig}, {data: movie}, {data: videos}] = await Promise.all([
    useFetch(`${config.public.apiBase}/configuration`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
      server: false,
    }),
    useFetch(`${config.public.apiBase}/movie/${route.params.id}`, {
      query: {
        language: 'es-MX',
        page,
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
      watch: [page],
      server: false,
    }),
    useFetch(`${config.public.apiBase}/movie/${route.params.id}/videos`, {
      query: {
        language: 'es-MX',
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
      server: false,
    }),
  ])
  
  const trailerUrl = ref(null)
  
  watch([videos], () => {
    if(!videos.value) return null
    console.log("me ejecuto", videos.value)
    const trailer = videos.value.results.find(video => video.type === "Trailer" && video.site === "YouTube")
    
    if(trailer) {
      trailerUrl.value = `https://www.youtube.com/embed/${trailer.key}`
    }
  }, {immediate: true})
  
  console.log(movie, movieDBConfig, videos, trailerUrl)
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-4">
    <header class="flex items-center mb-8">
      <button @click="router.back" class="flex items-center bg-accent max-h-8 rounded overflow-hidden">
        <span class="bg-primary-button h-full"><nuxt-icon name="arrow-back" class="text-2xl"></nuxt-icon></span>
        <span class="font-semibold px-2">Volver</span>
      </button>
      <h1 class="sm:text-4xl text-xl font-bold text-center flex-1">Detalles de la película</h1>
    </header>
    <main>
      <div class="flex justify-center flex-col lg:flex-row gap-4 mb-8">
        <div class=" lg:w-2/3 full-w">
          <img :src="`${movieDBConfig.images.secure_base_url}${movieDBConfig.images.backdrop_sizes[3]}${movie.backdrop_path}`" :alt="movie.title" />
        </div>
        <div class="flex flex-col full-w lg:w-1/3 min-w-[342px] [&>*]:mb-4">
          <h2 class="text-3xl font-bold ">{{movie.title}}</h2>
          <div class="">
            <span class="font-bold underline">Sinopsis</span>
            <p v-if="movie.overview">{{movie.overview}}</p>
            <p v-else>Sin sinopsis en español.</p>
          </div>
          <div>
            <span class="block mb-2 font-bold underline">Géneros</span>
            <div class="flex flex-wrap gap-3 ml-[-0.25rem] ">
              <span  
                v-if="movie.genres.length"
                v-for="genre in movie.genres" :key="genre?.id"
                class="text-xs px-3 font-medium bg-blue-500 text-white rounded-full py-1.5">
                {{genre.name}}
              </span>
              <span v-else>Sin categorías disponibles.</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span class="block font-bold underline text-xl mb-4">Trailer</span>
        <iframe v-if="trailerUrl" :src="trailerUrl" class="w-full aspect-video"  frameborder="0" allowfullscreen></iframe>
        <span v-else>Sin trailer disponible.</span>
      </div>
    </main>
  </div>
    
</template>
<style>
</style>