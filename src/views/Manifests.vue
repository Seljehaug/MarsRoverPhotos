<template>
  <div class="home">
    <div class="manifests">
      <Manifest :rover="curiosity"/>
      <Manifest :rover="opportunity"/>
      <Manifest :rover="spirit"/>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Manifest from "@/components/Manifest.vue";
  import {Rover} from "@/enums/enums";

  export default Vue.extend({
    name: 'Manifests',
    props: {},
    data() {
      return {
        curiosity: Rover.Curiosity,
        opportunity: Rover.Opportunity,
        spirit: Rover.Spirit,
      }
    },
    components: {
      Manifest
    }
  });
</script>

<style scoped lang="scss">
  .home {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .manifests {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin-top: 2rem;
  }
</style>
