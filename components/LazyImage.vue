<script setup lang="ts">
  type LazyImageProps = {
    src?: string,
    alt?: string,
  }
  const {src} = defineProps<LazyImageProps>()

  const defaultImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
  
  const srcImage = ref<LazyImageProps["src"]>(defaultImage)
  const imageRef = ref<HTMLImageElement | null>(null)

  onMounted(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          srcImage.value = src;
          observer.unobserve(entry.target); 
        }
      });
    });

    if(imageRef.value) {
      observer.observe(imageRef.value);
    }
    onBeforeUnmount(() => {
      observer.disconnect();
    });
  });

</script>
<template>
  <img ref="imageRef" v-bind="$attrs" :src="srcImage" />
</template>