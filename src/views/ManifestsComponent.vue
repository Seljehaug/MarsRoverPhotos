<template>
  <div class="home">
    <div class="manifests">
      <ManifestComponent :rover="curiosity"/>
      <ManifestComponent :rover="opportunity"/>
      <ManifestComponent :rover="spirit"/>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ManifestComponent from "@/components/ManifestComponent.vue";
  import {Rover} from "@/enums";

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
      ManifestComponent
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
