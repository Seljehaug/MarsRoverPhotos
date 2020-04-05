<template>
  <div class="image-grid">
    <ImageComponent v-for="image in images" :key="image.id" :image="image"></ImageComponent>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import ImageComponent from '@/components/ImageComponent.vue';

  interface IImageGrid {
    // $emit: any;
    // Props
    images: []; // TODO
  }

  export default Vue.extend({
    name: 'ImageGridComponent',
    props: {
      images: {
        required: true
      }
    },
    data() {
      return {}
    },
    created() {
    },
    methods: {

    },
    components: {
      ImageComponent
    }
  });
</script>

<style scoped lang="scss">
  @import "src/assets/styles/variables";

  .image-grid {
    margin-top: 1rem;

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-gap: .5rem;
  }
</style>
