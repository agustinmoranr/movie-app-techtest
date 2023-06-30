// useLocalStorage.ts

export default function useLocalStorage<T>(key: string, initialValue = null): {
  value: Ref<T | null>;
  setValue: (newValue: T) => void;
  removeValue: () => void;
} {
  const value: Ref<T | null> = ref<T | null>(initialValue);

  onMounted(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      value.value = JSON.parse(storedValue);
    }
  });

  const setValue = (newValue: T) => {
    value.value = newValue;
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  const removeValue = () => {
    value.value = initialValue;
    localStorage.removeItem(key);
  };

  return {
    value,
    setValue,
    removeValue,
  };
}