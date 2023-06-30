# Prueba Técnica

Descripción de la prueba técnica: 

Desarrollar una Aplicación (Single Page Application) con Vue 3, Bootstrap/Tailwind, Vuex y Axios. Debe
consumir al menos 3 endpoints de la API de  [The movie database](https://developers.themoviedb.org/). La app
estará compuesta de 2 routes ( / y /movieDetail/idMovie), en el route / se debe desplegar una sección con
una lista de películas (imagen del poster, nombre de película, preview de resumen, año de estreno y género)
además de una sección de filtrado con al menos 2 rubros (año, director, género, etc) y al cambiar alguno de
los rubros en los filtros se debe actualizar la lista de películas de manera asíncrona.

Al dar clic en el poster de alguna película, debe direccionar al route movieDetail con el id de la película
correspondiente y desplegar su información, agregar los medios para regresar a la raíz (breadcrumb o liga a
home).

Seguir patrón de composición de VUE con la idea de reutilizar componentes Web.
Se tiene la libertad creativa para agregar cualquier funcionalidad y/o interacción de usuario extra, además de
los elementos gráficos.

Tecnologías implementadas:
- Nuxt.js 3
- Tailwindcss
- [The movie database](https://developers.themoviedb.org/)

**Funcionalidades implementadas extra a la prueba técnica**:
- Funcionalidad de scroll infinito: La paginación se realiza automaticamente al scrollear y hallar la última película mostrada.
- Uso de local storage persistencia en filtros aplicados: En caso de filtrar las películas, y luego ir a la vista de detalle de alguna. Si el usuario regresa al home,  las película
mostradas al usuario serán utilizando los últimos filtros que haya utilizado.

Esta es mi solución al test técnico [Movie App](https://techtest-moviedb.netlify.app/)

Desktop: 
![localhost_3000_](https://github.com/agustinmoranr/movie-app-techtest/assets/54689488/0dacd4a9-c9dc-416f-bd7f-5c0cc188f7cf)
![techtest-moviedb netlify app_movieDetail_569094](https://github.com/agustinmoranr/movie-app-techtest/assets/54689488/310facd4-48b3-4b29-959f-4570b64d58d9)


Mobile:
![localhost_3000_(iPhone 12 Pro)](https://github.com/agustinmoranr/movie-app-techtest/assets/54689488/62de561c-b034-47ae-bd1e-23da77032bc8)
![techtest-moviedb netlify app_movieDetail_569094(iPhone 12 Pro)](https://github.com/agustinmoranr/movie-app-techtest/assets/54689488/f0409aad-ec74-405b-bdfb-639f5d2a6fc5)


