export default function useCount() {
  const count: Ref<number> = ref(0)
  const increment = (): number => count.value++
  const decrement = (): number => count.value--
  
  return {
    count, increment, decrement
  }
}