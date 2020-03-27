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
  import {RoverType} from "@/enums/enums";

  export default Vue.extend({
    name: 'Home',
    props: {},
    data() {
      return {
        curiosity: RoverType.Curiosity,
        opportunity: RoverType.Opportunity,
        spirit: RoverType.Spirit,
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
