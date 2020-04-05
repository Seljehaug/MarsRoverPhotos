<template>
  <div class="rover-images" v-if="manifestLoaded(id)">
    <SearchBarComponent :rover="rover" :manifest="manifest" @search="search"/>
    <ImageGridComponent :images="imagesFilteredByCameras"/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {NASA_API_KEY} from '../../configuration/API_KEY';
  import {NASA_API_BASE_URL, emptyManifest} from '@/utility';
  import {mapGetters} from 'vuex';
  import {IImage, IManifest} from '@/interfaces';
  import {Camera, Rover} from '@/enums';
  import SearchBarComponent from '@/components/SearchBarComponent.vue';
  import ImageGridComponent from '@/components/ImageGridComponent.vue';

  interface IRoverImages {
    rover: Rover;
    manifest: IManifest;
    // initialImagesLoaded: boolean;
    allImages: any[]; //TODO
    selectedCameras: Camera[];
    imagesFilteredByCameras: any[]; // TODO

    getManifestFromApiOrStore(rover: Rover): void;
    search(settings: {searchByEarthDate: boolean, query: string}): void;
    fetchImagesByEarthDate(date?: string): void;
    fetchImagesBySol(sol: string): void;

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
    computed: {
      ...mapGetters(['manifestLoaded', 'getManifest', 'getSelectedCameras'])
    },
    data() {
      return {
        rover: -1,
        manifest: emptyManifest,
        // initialImagesLoaded: false,
        allImages: [],
        selectedCameras: [],
        imagesFilteredByCameras: []
      }
    },
    async created() {
      const self = this as IRoverImages;
      self.rover = self.id;

      await self.getManifestFromApiOrStore(self.rover);
      // await self.fetchImagesByEarthDate();

      // TODO
      // self.selectedCameras = this.getSelectedCameras;

      // self.initialImagesLoaded = true;
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
          self.fetchImagesByEarthDate(settings.query);
        } else {
          self.fetchImagesBySol(settings.query);
        }
      },
      async fetchImagesByEarthDate(date?: string) {
        const self = this as IRoverImages;
        const roverName = Rover[self.rover].toLowerCase();
        const dateToUse = date === undefined || date === '' ? self.manifest.max_date : date;

        if(!date) {
          self.selectedCameras = this.getSelectedCameras;
        }

        self.allImages = [];
        await fetch(`${NASA_API_BASE_URL}/rovers/${roverName}/photos?earth_date=${dateToUse}&api_key=${NASA_API_KEY}`)
          .then(response => {
            return response.json()
            .then(data => {
              data.photos.forEach((img: any) => {
                const {id, img_src} = img;
                const camera = Camera[img.camera.name];
                self.allImages.push({id, img_src, camera});
              });

              // if(date) {
                // self.imagesFilteredByCameras = self.allImages.filter(img => selected.includes(img.camera))
                // self.imagesFilteredByCameras = self.allImages.filter(img => this.getSelectedCameras.includes(img.camera))
              // }
            }
        )});
      },
      fetchImagesBySol(sol: string) {
        const self = this as IRoverImages;
        const roverName = Rover[self.rover].toLowerCase();
      },
      setManifestLoadedValue(action: string, value:boolean) {
        this.$store.dispatch(action, value);
      }
    },
    watch: {
      allImages: function() {
        const self = this as IRoverImages;
        self.imagesFilteredByCameras = [];
        self.imagesFilteredByCameras = self.allImages.filter(img => self.selectedCameras.includes(img.camera));
      }
    },
    components: {
      SearchBarComponent,
      ImageGridComponent
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

    .input-wrapper {
      width: 110px;

      input {
        max-width: 100%;
      }
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
