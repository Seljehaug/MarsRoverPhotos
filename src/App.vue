<template>
  <div id="app">
    <div class="background"></div>

    <h1 class="main-heading">
      <router-link :to="{name : 'Manifests'}">Mars rovers</router-link>
    </h1>

    <router-view/>
  </div>
</template>

<style lang="scss">
</style>
