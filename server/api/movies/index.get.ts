import axios from "axios"

const config = useRuntimeConfig();
const ENDPOINT = `${config.public.apiBase}/movie/now_playing?language=es-MX&page=1` 
const options = {
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${config.accessToken}`
  }
};

export default eventHandler(async (event) => {
  const res = await axios.get(ENDPOINT, options)
  return res.data
})