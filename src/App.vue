<template class="pagina-principal">
  <main>
    <h1>{{ titulo }}</h1>
    <p>Meu primeiro projeto em Vue.js</p>
  </main>
</template>

<script setup>
  const titulo = "Olá, mundo!";
</script>

<style scoped>
.pagina-principal {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
h1 {
  color: #42b983;
  font-family: 'Chillax', sans-serif;
}
</style>
