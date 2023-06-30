<script setup>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
  const config = useRuntimeConfig();
  const release_year = ref();
  const mode = ref("list")
  const moviesByYearPage = ref(1)
  const moviesNowPlayingPage = ref(1)
  const movies = ref({results: []})
  const genres = ref(null)
  const selectedGenres = ref([])
  const genresToQuery = ref([])
  const openGenresSelector = ref(false)
  const genresLoading = ref(false)
  const [{data: movieDBConfig}, {data: moviesNowPlaying}] = await Promise.all([
    useFetch(`${config.public.apiBase}/configuration`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
      server: false,
    }),
    useFetch(`${config.public.apiBase}/movie/now_playing`, {
      query: {
        language: 'es-MX',
        page: moviesNowPlayingPage,
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
      watch: [moviesNowPlayingPage],
      server: false,
    })
  ])

  const {data: moviesByYear, pending, error} = await useFetch(`${config.public.apiBase}/discover/movie`, {
    query: {
      include_adult: false,
      include_video: false,
      language: 'es-MX',
      page: moviesByYearPage,
      primary_release_year: release_year,
      sort_by: 'popularity.desc',
    },
    onRequest({ request, options}) {
      if(!release_year.value) {
        return request.signal.abort()
      }
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${config.public.accessToken}`
    },
    watch: [release_year, moviesByYearPage],
    server: false
  })

  const queryGenres = async () => {
    genresLoading.value = true
    if(genres.value) return 
    const res = await useFetch(`${config.public.apiBase}/genre/movie/list`, {
      query: {
        language: "es"
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
      server: false
    })

    genresLoading.value = false
    genres.value = res.data.value.genres
  }

  const handleOpenGenresSelector = async () => {
    openGenresSelector.value = true
    selectedGenres.value = genresToQuery.value
    await queryGenres()
  }

  watch([mode, release_year, moviesByYear], () => {
    if(mode.value === "release_year" && moviesByYear.value) {
      return movies.value = moviesByYear
    }

    movies.value = moviesNowPlaying ?? {results: []}
  }, {immediate: true})
  
  function handleSelectYear() {
    mode.value = "release_year"
  }
  const maxYear = `${new Date().getFullYear() + 1}`

  const onAccepGendersSelector = () => {
    genresToQuery.value = selectedGenres.value
    closeGenresSelector()
  }

  const closeGenresSelector = () => {
    selectedGenres.value = []
    openGenresSelector.value = false
  }

  const onCleanGenresFilter = () => {
    genresToQuery.value = []
  }

  const onSelectGenre = (genre) => {
    // we will toggle when user whant to select a genre
    const findIndex = selectedGenres.value.findIndex(genreItem => genreItem.id === genre.id)

    const shouldAdd = findIndex === -1

    if(shouldAdd) {
      return selectedGenres.value = [...selectedGenres.value, genre]
    }

    selectedGenres.value = selectedGenres.value.filter(genreItem => genreItem.id !== genre.id)
  }

  const genreDisabled = (genre) => {
    const selectedGenresIds = selectedGenres.value.map(genre => genre.id)
    return selectedGenresIds.includes(genre.id)
  }

  console.log({movieDBConfig, movies, genres, selectedGenres })
</script>

<template>
  <div class="max-w-screen-xl mx-auto p-4">
    <header class="mb-8"><h1 class="sm:text-4xl text-2xl font-bold text-center shadow-accent">Películas en cartelera</h1></header>
    <div class="">
      <header class="mb-2">
        <h2 class="sm:text-2xl text-lg">Cartelera</h2>
      </header>
      <div class="mb-4">
        <span>Filtrar por:</span>
        <div class="flex mt-2 gap-4">
          <div class="flex flex-col gap-1"> 
            <span class="text-sm">Categorías</span>
            <button @click="handleOpenGenresSelector" class="bg-primary-button py-1 px-2 rounded h-full">
              GENEROS
            </button>
          </div>
          <div class="flex flex-col gap-1 [&>.w-24]:w-full">
            <span class="text-sm">Año de lanzamiento</span>
            <div class="w-24">
              <VueDatePicker
              v-model="release_year"  
              @update:model-value="handleSelectYear"
              :max-date="maxYear"
              :action-row="{showCancel: false}" 
              :hide-input-icon="true"
              input-class-name="!py-1 "
              locale="es" 
              select-text="Aceptar" 
              year-picker 
              placeholder="Año"
              />
          </div>
          </div>
        </div>
        <div v-if="genresToQuery.length && !openGenresSelector" class="flex flex-wrap items-center gap-2 mt-2">
          <span v-for="genre in genresToQuery" 
          class="text-xs px-3 font-medium bg-blue-500 text-text-primary rounded-full py-1.5" >{{genre.name}}</span>
          <button @click="onCleanGenresFilter" class="bg-primary-button rounded-full w-[28px] h-[28px]">X</button>
        </div>
        <div v-if="openGenresSelector">
          <div class="flex flex-wrap gap-2 w-[30vw] min-w-[300px] min-h-[200px] p-4 bg-text-primary text-background rounded mx-[auto] mt-2" v-if="genres">
            <div class="flex flex-wrap gap-2">
              <span v-for="genre in genres" @click="onSelectGenre(genre, $event)" 
              class="text-xs px-3 font-medium text-text-primary rounded-full py-1.5 cursor-pointer" 
              :class="{'bg-accent': genreDisabled(genre), 'bg-blue-500': !genreDisabled(genre)}"
              >
                {{genre.name}}
              </span>
            </div>
            <div class="flex gap-2 ml-[auto]">
              <button @click="closeGenresSelector" class="bg-primary-button py-1 px-2 rounded text-text-primary">CANCELAR</button>
              <button @click="onAccepGendersSelector"  class="bg-primary-button py-1 px-2 rounded text-text-primary">ACEPTAR</button>
            </div>
          </div>
          <div v-else class="animate-pulse w-[30vw] mx-[auto] mt-2 min-w-[300px] min-h-[200px] bg-text-primary rounded"  />
        </div>
      </div>
      <main>
        <section class="grid  md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
          <MovieCard 
            v-for="movie in movies.value?.results" 
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