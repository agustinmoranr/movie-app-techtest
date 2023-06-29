<script setup>
  import axios from 'axios';
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
  const config = useRuntimeConfig();
  const release_year = ref();
  const mode = ref("list")
  const moviesByYearPage = ref(1)
  const moviesNowPlayingPage = ref(1)
  let movies = {results: []}
  const [{data: movieDBConfig}, {data: moviesNowPlaying}] = await Promise.all([
    axios.get(`${config.public.apiBase}/configuration`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
    }),
    axios.get(`${config.public.apiBase}/movie/now_playing`, {
      params: {
        language: 'es-MX',
        page: moviesNowPlayingPage,
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
    })
  ])

  const { data: moviesByYear } = await axios.get(`${config.public.apiBase}/discover/movie`, {
    params: {
      include_adult: false,
      include_video: false,
      language: 'es-MX',
      page: moviesByYearPage,
      primary_release_year: release_year,
      sort_by: 'popularity.desc',
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${config.public.accessToken}`
    },
  })

  watch([mode, release_year], () => {
    if(mode.value === "release_year" && moviesByYear.value) {
      return movies = moviesByYear
    }

    movies = moviesNowPlaying ?? {results: []}
  }, {immediate: true})
  
  function handleSelectYear() {
    mode.value = "release_year"
  }
  const maxYear = `${new Date().getFullYear() + 1}`  

  console.log({movieDBConfig,moviesByYear, moviesNowPlaying, movies})
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-4">
    <header><h1 class="text-4xl text-center">Nuevos lanzamientos</h1></header>
    <div class="">
      <header class="mb-4">
        <h2 class="text-3xl ">Cartelera</h2>
      </header>
      <div class="mb-4">
        <span>Filtrar por:</span>
        <div class="flex flex-col gap-1 mt-2">
          <span class="text-sm">Año de lanzamiento</span>
          <div class="w-24">
            <VueDatePicker
            v-model="release_year"  
            @update:model-value="handleSelectYear"
            :max-date="maxYear"
            :action-row="{showCancel: false}" 
            :hide-input-icon="true"
            input-class-name="!py-0.5"
            locale="es" 
            select-text="Aceptar" 
            year-picker 
            placeholder="Año"
            />
          </div>
        </div>
      </div>
      <main>
        <section class="grid  md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          <MovieCard 
            v-for="movie in movies.results" 
            :key="movie.id" 
            :src="`${config.public.apiBaseImages}/${movieDBConfig.images.poster_sizes[4]}${movie.poster_path}`"
            :title="movie.title"
            :overview="movie.overview"
            :id="movie.id"
          />
          
        </section>
      </main>
    </div>
  </div>

</template>
<style>
 
</style>