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
  
  const trailer = ref(null)
  
  watch([videos], () => {
    if(!videos.value) return null
    const filteredTriler = videos.value.results.find(video => video.type === "Trailer" && video.site === "YouTube")
    
    if(filteredTriler) {
      trailer.value = {...filteredTriler, url: `https://www.youtube.com/embed/${filteredTriler.key}`}
    }
  }, {immediate: true})
  
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 py-8">
    <header class="flex items-center mb-8">
      <button @click="router.back" class="flex items-center bg-primary-button  max-h-8 rounded overflow-hidden">
        <span class="bg-accent h-full"><nuxt-icon name="arrow-back" class="text-2xl"></nuxt-icon></span>
        <span class="font-semibold px-2">Volver</span>
      </button>
      <h1 class="sm:text-4xl text-xl font-bold text-center flex-1">{{movie.title}}</h1>
    </header>
    <main>
      <section class="flex justify-center flex-col lg:flex-row gap-4 mb-8">
        <div class=" lg:w-2/3 full-w">
          <img :src="`${movieDBConfig.images.secure_base_url}${movieDBConfig.images.backdrop_sizes[3]}${movie.backdrop_path}`" :alt="movie.title" :title="movie.title" />
        </div>
        <div class="flex flex-col full-w lg:w-1/3 min-w-[364px] [&>*]:mb-4">
          <div>
            <div class="mb-2">
              <div class="flex items-end gap-2 flex-wrap ">
                <h2 class="sm:text-3xl text-xl font-bold break-words">{{movie.original_title}}</h2>
                <span class="text-xs italic mb-[0.25rem] ">(Titulo original).</span>
              </div>
              <span class="flex-1 text-sm italic" v-if="movie.tagline"><span class="font-semibold">Lema:</span> "{{ movie.tagline }}"</span>
            </div>
            <div class="flex flex-col flex-wrap gap-1">
              <span v-if="movie.release_date"><span class="font-semibold">fecha de lanzamiento:</span> {{movie.release_date}}</span>
              <span v-if="movie.budget"><span class="font-semibold">Presupuesto:</span> ${{movie.budget}} (USD)</span>
              <span v-if="movie.revenue"><span class="font-semibold">Recaudación:</span> ${{movie.revenue}} (USD)</span>
              <span v-if="movie.vote_average"><span class="font-semibold">Puntuacion:</span> {{ Math.floor(movie.vote_average) }}/10 en TMDB</span>
            </div>
          </div>
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
      </section>
      <section>
        <span v-if="trailer?.name" class="block font-bold underline text-xl mb-4">Trailer: <span>{{ trailer.name }}</span></span>
        <iframe v-if="trailer?.url" :src="trailer?.url" class="w-full aspect-video"  frameborder="0" allowfullscreen></iframe>
        <span v-else>Sin trailer disponible.</span>
      </section>
    </main>
  </div>
    
</template>
<style>
</style>