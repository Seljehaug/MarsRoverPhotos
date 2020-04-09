<template>
  <div class="image-wrapper">
    <img v-lazy="image.img_src" class="image" alt=""/>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';


  interface IImage {
    // $emit: any;
  }

  export default Vue.extend({
    name: 'ImageComponent',
    props: {
      image: {
        required: true
      }
    },
    data() {
      return {}
    },
    async created() {
    },
    computed: {
    },
    methods: {
    }
  });
</script>

<style scoped lang="scss">
  @import "src/assets/styles/variables";

  .image-wrapper {
    display: flex;
    justify-content: center;
    background: rgba(0, 0, 0, 0.9);
    height: 150px;

    // Flexbox fallback for browsers not supporting grid
    width: 150px;
    margin: 0.5rem;

    .image {
      background-size: cover;
      max-width: 100%;
      align-self: center;
      max-height: 150px;
    }
  }

  @supports(display: grid) {
    .image-wrapper {
      width: auto;
      margin: 0;
    }

  }
</style>
