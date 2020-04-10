<template>
  <div id="light-box" ref="lightbox" :class="lightBoxClass" @keyup.left="prevImage" @keyup.right="nextImage" @keyup.esc="closeLightBox" tabindex="0">

    <div class="overlay" v-touch:swipe="handleSwipe"></div>
    <div class="lightbox-content" v-touch:swipe="handleSwipe">

      <div class="controls-left">
        <button @click="prevImage" class="previous-btn">
          <Arrow class="arrow-left"/>
        </button>
      </div>

      <img :src="activeImageSrc" alt="">
      <p class="camera">Camera: <span>{{activeImage.cameraName}}</span></p>

      <div class="controls-right">
        <button @click="nextImage" class="next-btn">
          <Arrow class="arrow-right"/>
        </button>
      </div>

      <button @click="closeLightBox" class="close-btn">
        <Escape/>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
  import Arrow from '@/assets/icons/Arrow.vue';
  import Escape from '@/assets/icons/Escape.vue';
  import {IImageData} from '@/interfaces';

  interface ILightBox {
    $emit: any;
    $refs: any;

    closeLightBox(): void;
    prevImage(): void;
    nextImage(): void;
    handleSwipe(direction: string): void;

    // Props
    activeImagePos: number;
    lightBoxIsActive: boolean;
    activeImage: IImageData;
  }

  export default {
    name: 'LightBoxComponent',
    props: {
      activeImagePos: { type: Number, required: true },
      lightBoxIsActive: { type: Boolean, required: true },
      activeImage: Object as () => IImageData
    },
    mounted() {
      const self = this as unknown as ILightBox;
      self.$refs.lightbox.focus();
    },
    computed: {
      activeImageSrc() {
        const self = this as unknown as ILightBox;
        return (self.lightBoxIsActive && self.activeImage !== null) ? self.activeImage.img_src : '';
      },
      lightBoxClass() {
        const self = this as unknown as ILightBox;
        return self.lightBoxIsActive ? 'lightbox-active' : 'lightbox-inactive';
      }
    },
    methods: {
      closeLightBox() {
        const self = this as ILightBox;
        self.$emit('closeLightBox', false);
      },

      prevImage() {
        const self = this as ILightBox;
        self.$emit('prevImage');
      },

      nextImage() {
        const self = this as ILightBox;
        self.$emit('nextImage');
      },

      handleSwipe(direction: string) {
        if(direction === 'left'){
          this.nextImage();
        }
        if(direction === 'right'){
          this.prevImage();
        }
      }
    },
    components: {
      Arrow,
      Escape
    }
  };
</script>

<style scoped lang="scss">
  @import 'src/assets/styles/variables';

  .lightbox-content {
    z-index: 50;
    position: relative;
    padding: 2rem 0;
    background: black;
    min-height: 150px;
    min-width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #light-box {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    z-index: 100;
    background-size: cover;
    padding: 3rem calc(3rem + 5vw);

    &.lightbox-active {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.lightbox-inactive {
      display: none;
    }

    img {
      max-width: 100%;
      z-index: 100;
      background: black;
      max-height: 80vh;
    }

    .camera {
      position: absolute;
      bottom: 8px;
      font-size: 1rem;
      span {
        font-size: 0.85rem;
        font-weight: bold;
      }
    }
  }

  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: black;
    opacity: 0.85;
  }

  .controls-left, .controls-right {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 5vw;
    display: flex;
  }

  .controls-left {
    left: -5vw;
  }

  .controls-right {
    right: -5vw;
  }

  .previous-btn, .next-btn {
    z-index: 100;
    height: 100%;
    width: 100px;
    background-color: black;
    border: none;
    cursor: pointer;
    &:hover {
      outline: none;
      .arrow {
        fill: $color-accent;
        transition: fill 100ms ease-in;
      }
    }
  }

  .arrow {
    fill:#d2d6df;
    height: 50%;
    width: 50%;
  }

  .arrow-right {
    transform: rotate(180deg);
  }

  .close-btn {
    position: absolute;
    top: 0.5rem;
    right: calc(-5vw - 0.5rem);
    z-index: 100;
    background: black;
    border-radius: 100%;
    border: 1px solid #d2d6df;
    padding: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 30px;
    height: 30px;

    &:hover, &:focus {
      transform: scale(1.2);
      border-color: #d36c6c;
      outline: none;
      transition: transform 100ms ease-in, border-color 100ms ease-in;

      svg {
        fill: #d36c6c;
        transition: fill 100ms ease-in;
      }
    }

    svg {
      width: 100%;
      height: 100%;
      fill: #d2d6df;
    }
  }
  @media(max-width: 700px) {
    #light-box {
      .lightbox-content {
        padding: 2rem;
      }
      .controls-left, .controls-right {
        top: auto;
        bottom: -2.25rem;
        width: 50%;
      }
      .controls-left {
        left: 0;
        justify-content: flex-end;
      }
      .controls-right {
        right: 0;
        justify-content: flex-start;
      }
      .previous-btn, .next-btn {
        border: 1px solid #cbcbcb;
        border-radius: 3px;
        padding: 0.5rem;
        width: 70px;
      }
      .close-btn {
        position: fixed;
        width: 35px;
        height: 35px;
        top: 0.5rem;
        left: 0.5rem;
      }
    }
  }

  @media(max-width: 700px) and (orientation: portrait) {
    #light-box {
      padding: 2rem 0;

      .lightbox-content {
        padding: 2rem 0;
      }

      .controls-left, .controls-right {
        bottom: -1.25rem;
      }
    }
  }

  @media(max-width: 700px) and (orientation: landscape) {
    #light-box {
      .lightbox-content {
        margin-bottom: 1rem;
        padding: 1rem 0;
      }

      .controls-left, .controls-right {
        bottom: -2.25rem;
      }

      img {
        max-height: 65vh;
      }
    }
  }
</style>
