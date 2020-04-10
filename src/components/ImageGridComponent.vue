<template>
  <div class="image-grid">
    <ImageComponent v-for="(image, index) in images" :key="image.id" :image="image" :index="index" @open-lightbox="openLightBox"></ImageComponent>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import ImageComponent from '@/components/ImageComponent.vue';
  import {IImageData} from '@/interfaces';

  interface IImageGrid {
    $emit: any;

    openLightBox(index: number): void;

    // Props
    images: IImageData[];
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
    methods: {
      openLightBox(index: number) {
        const self = this as IImageGrid;
        self.$emit('open-lightbox', index);
      }
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

    // Flexbox fallback for browser not supporting grid
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  @supports(display: grid) {
    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      grid-gap: .5rem;
    }
  }
</style>
