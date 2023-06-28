

<script setup>
  const [{data: config}, {data: movies}] = await Promise.all([
    useFetch('/api/movieDBConfig'),
    useFetch('/api/movies')
  ])
  
  console.log(config.value)
  console.log(movies.value)
  
  const  {count, increment, decrement} = useCount()
</script>

<template>
  <h1 class="text-3xl font-bold underline">Hello vue</h1>
  <div class="flex gap-2">
    <button @click="increment" class="p-2 rounded border bg-gray-200" >Increment</button>
    <button @click="decrement" class="p-2 rounded border bg-gray-200">Decrement</button>
  </div>
  {{ count }}
  <NuxtLink to="/movieDetail/1">Movie 1</NuxtLink>
</template>
<style>
</style>