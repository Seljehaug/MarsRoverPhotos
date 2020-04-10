<template>
  <div class="image-wrapper" @click="openLightBox">
    <img v-lazy="image.img_src" class="image" alt=""/>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';


  interface IImage {
    $emit: any;

    openLightBox(): void;

    // Props
    image: any;
    index: number;
  }

  export default Vue.extend({
    name: 'ImageComponent',
    props: {
      image: {
        required: true
      },
      index: {
        type: Number,
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
      openLightBox() {
        const self = this as IImage;
        self.$emit('open-lightbox', self.index);
      }
    }
  });
</script>

<style scoped lang="scss">
  @import "src/assets/styles/variables";

  .image-wrapper {
    cursor: pointer;
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

      // Flexbox fallback
      width: 100%;
    }
  }

  @supports(display: grid) {
    .image-wrapper {
      width: auto;
      margin: 0;

      .image {
        width: auto;
      }
    }

  }
</style>
