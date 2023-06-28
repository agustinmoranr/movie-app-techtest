<script setup>
  const route = useRoute()    
  const router = useRouter()
  const {increment, decrement, count} = useCount()

</script>

<template>
  <h1 class="text-3xl font-bold underline">{{ route.params.id }}</h1>
  
  <div class="flex gap-2">
    <button @click="increment" class="p-2 rounded border bg-gray-200" >Increment</button>
    <button @click="decrement" class="p-2 rounded border bg-gray-200">Decrement</button>
  </div>
  {{ count }}

  <button @click="router.back">go Back</button>
</template>
<style>
</style>