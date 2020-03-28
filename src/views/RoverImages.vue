<template>
  <div class="rover-images">
    <p>Rover images</p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'RoverImages',
    props: {
      id: {
        required: true,
        type: Number
      }
    },
    data() {
      return {
      }
    }
  });
</script>

<style scoped lang="scss">
</style>
