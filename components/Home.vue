<script setup>
  import VueDatePicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'
  const { value: mode, setValue: setModeValue } = useLocalStorage('mode', 'list');
  const { value: release_year, setValue: setReleaseYearValue, removeValue: removeYear } = useLocalStorage('release_year');
  const { value: genresToQuery, setValue: setGenresToQueryValue, removeValue: removeGenres } = useLocalStorage('genresToQuery', []);
  const config = useRuntimeConfig();
  const currentPage = ref(1)
  const genres = ref(null)
  const selectedGenres = ref([])
  const openGenresSelector = ref(false)
  const genresLoading = ref(false)
  const with_genres = computed(() => genresToQuery.value.map(genre => genre.id).join("|"))
  const maxYear = `${new Date().getFullYear() + 1}`

  const queryMoviesNowPlaying = (page) => {
    return useFetch(`${config.public.apiBase}/movie/now_playing`, {
      query: {
        language: 'es-MX',
        page,
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
      server: false,
    })
  }

  const queryMoviesByFiltering = async (page) => {
    return useFetch(`${config.public.apiBase}/discover/movie`, {
      query: {
        include_adult: false,
        include_video: false,
        language: 'es-MX',
        page,
        primary_release_year: release_year,
        with_genres,
        sort_by: 'popularity.desc',
      },
      onRequest({ request, options}) {
        if(!release_year.value && !with_genres.value.length) {
          return request.signal.abort()
        }
      },
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
      server: false
    })
  }

  const handleQueryMovies = async (page = 1) => {
    if(mode.value === "list") {
      return queryMoviesNowPlaying(page)
    } else {
      return queryMoviesByFiltering(page)
    }
  }

  const [{data: movieDBConfig}, {data: movies}] = await Promise.all([
    useFetch(`${config.public.apiBase}/configuration`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${config.public.accessToken}`
      },
      server: false,
    }),
    handleQueryMovies(currentPage.value)
  ])

  const handleSelectYear = (value) => {
    setReleaseYearValue(value)
  }

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

  watch([release_year, with_genres], () => {
    if(release_year.value || Boolean(with_genres.value)) {
      setModeValue("filtering")
    } else {
      setModeValue("list")
    }
  })

  watch([mode, release_year, with_genres], async () => {
    currentPage.value = 1
    const res = await handleQueryMovies(currentPage.value)
    movies.value = res.data.value
  })

  const handleOpenGenresSelector = async () => {
    openGenresSelector.value = true
    selectedGenres.value = genresToQuery.value
    await queryGenres()
  }


  const onAccepGendersSelector = () => {
    // genresToQuery.value = selectedGenres.value
    setGenresToQueryValue(selectedGenres.value)
    closeGenresSelector()
  }

  const closeGenresSelector = () => {
    selectedGenres.value = []
    openGenresSelector.value = false
  }

  const onCleanGenresFilter = () => {
    // genresToQuery.value = []
    removeGenres()
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

  const genreSelected = (genre) => {
    const selectedGenresIds = selectedGenres.value.map(genre => genre.id)
    return selectedGenresIds.includes(genre.id)
  }

  const acceptGenreDisabled = computed(() => {
    //compare genresToQuery with selectedGenres if are equal we will disable the button
    const selectedGenresIds = selectedGenres.value.map(genre => genre.id)
    const genresToQueryIds = genresToQuery.value.map(genre => genre.id)

    return selectedGenresIds.sort().join(',') === genresToQueryIds.sort().join(',') || !selectedGenres.value.length
  })

  const onIntersectMovieCard = async (index, element) => {
    // if it is the last item in list query more results
    if((index === movies.value?.results?.length - 1) && currentPage.value <= movies.value.total_pages) {
      currentPage.value++
      const newMovies = await handleQueryMovies(currentPage.value)

      if(!newMovies.error.value) {
        movies.value.results = [...movies.value.results, ...newMovies.data.value.results]
      }
    }
  }

</script>

<template>
  <div class="max-w-screen-xl mx-auto sm:px-4 px-2 py-8">
    <header class="mb-8"><h1 class="sm:text-4xl text-2xl font-bold text-center shadow-accent">Películas en cartelera</h1></header>
    <div class="">
      <header class="mb-2">
        <h2 class="sm:text-2xl text-lg">Cartelera</h2>
      </header>
      <div class="mb-4">
        <span class="font-semibold">Filtrar por:</span>
        <div class="flex mt-2 gap-4">
          <div class="flex flex-col gap-1 min-w-[50%] sm:min-w-[auto]"> 
            <span class="text-sm">Categorías de géneros</span>
            <button @click="handleOpenGenresSelector" class="bg-primary-button py-1 px-2 rounded h-full text-sm uppercase">
              Géneros
            </button>
          </div>
          <div class="flex flex-col gap-1 [&>.w-24]:w-full">
            <span class="text-sm">Año de lanzamiento</span>
            <div class="w-24">
              <VueDatePicker
              v-model="release_year"  
              @update:model-value="handleSelectYear"
              @cleared="removeYear"
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
        <div class="relative">
          <div v-if="openGenresSelector" class="absolute inset-0 z-10 sm:right-auto">
            <div class="flex flex-wrap gap-2 w-[30vw] min-w-[300px] min-h-[200px] p-4 bg-text-primary text-background rounded mx-[auto] mt-2 " v-if="genres">
              <h3 class="ml-1 text-xl">Selecciona categorías</h3>
              <hr class="w-full border-t-2">
              <div class="flex flex-wrap gap-2">
                <span v-for="genre in genres" @click="onSelectGenre(genre, $event)" 
                class="text-xs px-3 font-medium text-text-primary rounded-full py-1.5 cursor-pointer" 
                :class="{'bg-accent': genreSelected(genre), 'bg-blue-500': !genreSelected(genre)}"
                >
                  {{genre.name}}
                </span>
              </div>
              <div class="flex gap-2 ml-[auto] mb-[-0.5rem] mt-2 text-sm">
                <button @click="closeGenresSelector" class="bg-primary-button py-1 px-2 rounded text-text-primary">CANCELAR</button>
                <button @click="onAccepGendersSelector" :disabled="acceptGenreDisabled"  class="bg-primary-button py-1 px-2 rounded text-text-primary disabled:opacity-40">FILTRAR</button>
              </div>
            </div>
            <div v-else class="animate-pulse w-[30vw] mx-[auto] mt-2 min-w-[300px] min-h-[200px] bg-text-primary rounded"  />
          </div>
        </div>
      </div>
      <main>
        <section class="grid grid-cols-3 sm:gap-4 gap-2">
          <MovieCard 
            v-if="movies?.results.length"
            v-for="(movie, index) in movies?.results" 
            :key="movie.id" 
            :src="`${config.public.apiBaseImages}/${movieDBConfig.images.poster_sizes[4]}${movie.poster_path}`"
            :mobile-src="`${config.public.apiBaseImages}/${movieDBConfig.images.poster_sizes[1]}${movie.poster_path}`"
            :title="movie.title"
            :overview="movie.overview"
            :id="movie.id"
            :on-intersecting="(movieCardEl) => onIntersectMovieCard(index, movieCardEl)"
          />
          <div v-else class="h-[600px] animate-pulse bg-text-primary rounded">
            </div>
        </section>
      </main>
    </div>
  </div>

</template>
<style>
 
</style>