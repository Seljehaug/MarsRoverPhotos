<template>
  <div class="rover-images" v-if="manifestLoaded(id)">
    <SearchBarComponent :rover="rover" :manifest="manifest" @search="search"/>
    <ImageGridComponent :images="imagesFilteredByCameras" @open-lightbox="openLightBox"/>
    <LightBoxComponent v-if="lightBoxIsActive" :activeImage="activeImage" :activeImagePos="activeImagePos" :lightBoxIsActive="lightBoxIsActive"
      @closeLightBox="closeLightBox" @prevImage="prevImage" @nextImage="nextImage"
    />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {NASA_API_KEY} from '../../configuration/API_KEY';
  import {NASA_API_BASE_URL, emptyManifest} from '@/utility';
  import {mapGetters} from 'vuex';
  import {IImageData, IManifest} from '@/interfaces';
  import {Camera, Rover} from '@/enums';
  import SearchBarComponent from '@/components/SearchBarComponent.vue';
  import ImageGridComponent from '@/components/ImageGridComponent.vue';
  import LightBoxComponent from '@/components/LightBoxComponent.vue';

  interface IRoverImages {
    rover: Rover;
    manifest: IManifest;
    allImages: IImageData[];
    selectedCameras: Camera[];
    imagesFilteredByCameras: IImageData[];
    activeImagePos: number;
    lightBoxIsActive: boolean;
    activeImage: any;
    $refs: any;

    getManifestFromApiOrStore(rover: Rover): void;
    search(settings: {searchByEarthDate: boolean, query: string}): void;
    searchImagesByEarthDate(date?: string): void;
    searchImagesBySol(sol: string): void;
    fetchImages(url: string): void;
    openLightBox(index: number): void;
    closeLightBox(): void;
    prevImage(): void;
    nextImage(): void;

    // Props
    id: number;
  }

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
        rover: -1,
        manifest: emptyManifest,
        allImages: [],
        selectedCameras: [],
        imagesFilteredByCameras: [],
        activeImagePos: 0,
        lightBoxIsActive: false,
        activeImage: null
      }
    },
    computed: {
      ...mapGetters(['manifestLoaded', 'getManifest', 'getSelectedCameras'])
    },
    async created() {
      const self = this as IRoverImages;
      self.rover = self.id;
      await self.getManifestFromApiOrStore(self.rover);
    },
    methods: {
      async getManifestFromApiOrStore(rover: Rover) {
        const self = this as IRoverImages;
        const roverName = Rover[rover].toLowerCase();

        // manifest has been already loaded => fetch from store
        if(this.manifestLoaded(rover)) {
          self.manifest = this.getManifest(rover);
          return;
        }

        await fetch(`${NASA_API_BASE_URL}/manifests/${roverName}?api_key=${NASA_API_KEY}`)
          .then(response => {
            return response.json()
              .then(data => {
                self.manifest = data.photo_manifest;
              });
          });

        switch (rover) {
          case Rover.Curiosity:
            this.setManifestLoadedValue('setCuriosityManifestLoadedValue', true);
            break;
          case Rover.Opportunity:
            this.setManifestLoadedValue('setOpportunityManifestLoadedValue', true);
            break;
          case Rover.Spirit:
            this.setManifestLoadedValue('setSpiritManifestLoadedValue', true);
            break;
        }
      },
      search(settings: {searchByEarthDate: boolean, query: string}) {
        const self = this as IRoverImages;

        self.selectedCameras = this.getSelectedCameras;

        if(settings.searchByEarthDate) {
          self.searchImagesByEarthDate(settings.query);
        } else {
          self.searchImagesBySol(settings.query);
        }
      },
      searchImagesByEarthDate(date?: string) {
        const self = this as IRoverImages;

        if(!date) {
          self.selectedCameras = this.getSelectedCameras;
        }

        const roverName = Rover[self.rover].toLowerCase();
        const dateToUse = date === undefined || date === '' ? self.manifest.max_date : date;

        const url = `${NASA_API_BASE_URL}/rovers/${roverName}/photos?earth_date=${dateToUse}&api_key=${NASA_API_KEY}`;
        self.fetchImages(url);
      },
      searchImagesBySol(sol: string) {
        const self = this as IRoverImages;
        self.selectedCameras = this.getSelectedCameras;

        const roverName = Rover[self.rover].toLowerCase();
        const url = `${NASA_API_BASE_URL}/rovers/${roverName}/photos?sol=${sol}&api_key=${NASA_API_KEY}`;

        self.fetchImages(url);
      },
      fetchImages(url: string) {
        const self = this as IRoverImages;

        self.allImages = [];
        fetch(url)
          .then(response => {
            return response.json()
              .then(data => {
                data.photos.forEach((img: any) => {
                  const {id, img_src} = img;
                  const camera = Camera[img.camera.name];
                  self.allImages.push({id, img_src, camera: camera, cameraName: img.camera.name});
                });
              }
            )
          });
      },
      setManifestLoadedValue(action: string, value:boolean) {
        this.$store.dispatch(action, value);
      },
      openLightBox(index: number) {
        const self = this as IRoverImages;

        const imagePos = index;
        self.activeImagePos = imagePos;
        self.activeImage = self.imagesFilteredByCameras[imagePos];

        if(self.activeImage !== null){
          this.lightBoxIsActive = true;
        }
      },
      closeLightBox() {
        const self = this as IRoverImages;
        self.lightBoxIsActive = false;
      },
      prevImage() {
        const self = this as IRoverImages;
        self.activeImagePos = self.activeImagePos === 0  ? self.imagesFilteredByCameras.length -1 : self.activeImagePos -1;
        self.activeImage = self.imagesFilteredByCameras[self.activeImagePos];
      },
      nextImage() {
        const self = this as IRoverImages;
        self.activeImagePos = self.activeImagePos === self.imagesFilteredByCameras.length - 1 ? 0  : self.activeImagePos + 1;
        self.activeImage = self.imagesFilteredByCameras[self.activeImagePos];
      }
    },
    watch: {
      allImages: function() {
        const self = this as IRoverImages;
        self.imagesFilteredByCameras = self.allImages.filter(img => self.selectedCameras.includes(<Camera>img.camera));
      },
    },
    components: {
      SearchBarComponent,
      ImageGridComponent,
      LightBoxComponent
    }
  });
</script>

<style scoped lang="scss">
  @import "src/assets/styles/variables";

  .search-settings {
    --info-icon-size: 1.1rem;

    display: flex;
    width: 100%;
    background: $color-black-transparent;
    padding: 1rem;

    h2 {
      font-size: 1rem;
      display: inline-block;
      letter-spacing: 1px;
    }

    .info-icon {
      width: var(--info-icon-size);
      height: var(--info-icon-size);
      fill: $color-accent;
      color: white;
      cursor: default;
    }

    .date-and-sol-settings {
      display: flex;
      align-items: center;

      .content {
        margin-left: 1rem;
        display: flex;

        .switch {
          margin-right: 1rem;
          top: 2px;

          .info-icon {
            margin-left: 0.5rem;
            top: 0;
            right: 26px;
          }
        }

        .input-wrapper:first-child {
          margin-left: 1rem;
          margin-right: 1rem;
          height: 100%;
          width: 2px;
          background-color: $color-accent;
        }
      }

      &::after {
        content: '';
        height: 100%;
        width: 2px;
        background-color: $color-accent;
        margin-right: 1rem;
      }
    }

    .content {
      display: flex;
      flex-wrap: wrap;
      position: relative;
    }

    .search-button {
      align-self: center;
      margin-left: 1rem;
      height: 27px;
    }

    .divider {
      margin-left: 1rem;
    }

    .camera-settings {
      display: flex;
      align-items: center;

      .heading {
        position: relative;
        margin-right: 2.5rem;
      }

      .camera {
        margin: 0.25rem 0;
        font-size: 0.85rem;

        .label-text {
          position: relative;
          top: 2px;
        }
      }

      .info-icon {
        position: absolute;
        top: 3px;
        margin-left: 0.5rem;
      }
    }
  }
</style>
