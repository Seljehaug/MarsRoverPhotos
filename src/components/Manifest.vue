<template>
  <div class="manifest" v-show="allManifestsLoaded">
    <h2 class="manifest-heading">{{manifest.name}}</h2>

    <div class="manifest-info">
      <div class="launched">
        <h3 class="heading">Launched</h3>
        <p>{{manifest.launch_date | moment('MMM Do YYYY')}}</p>
      </div>

      <div class="landed">
        <h3 class="heading">Landed</h3>
        <p>{{manifest.landing_date | moment('MMM Do YYYY')}}</p>
      </div>

      <div class="status">
        <h3 class="heading">Status</h3>
        <p>{{manifest.status}}</p>
      </div>
    </div>

    <div class="total-images">
      <h3 class="heading">
        <span class="text">Total images taken</span>
        <router-link :to="{ name: 'RoverImages', params: { id: rover } }">See all</router-link>
      </h3>
      <p class="amount">{{manifest.total_photos}}</p>
    </div>

    <div class="recent-images">
      <h3 class="heading">Most recent ({{manifest.max_date | moment('MMM Do YYYY')}})</h3>
      <div class="images">
        <div class="image" v-for="photo in photosForLastDay">
          <img :src="photo.img_src" alt="image of Mars">
          <div class="img-overlay"></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import {mapGetters} from "vuex";
  import {NASA_API_KEY} from "../../configuration/API_KEY";
  import {NASA_API_BASE_URL} from '@/utility/utility';
  import {Rover} from "@/enums/enums";

  interface IManifestComponent {
    manifest: IManifest;
    photosForLastDay: any;
    latestImage: any;

    // props
    rover: Rover;

    getManifest(rover: Rover): void;
    getPhotosForLastDay(roverName: string): void;
  }

  interface IManifest {
    name: string;
    landing_date: string;
    launch_date: string;
    max_date: string;
    max_sol: number | null;
    status: string;
    total_photos: number | null;
  }

  export default Vue.extend({
    name: 'Manifest',
    props: {
      rover: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        manifest: {
          name: '',
          landing_date: '',
          launch_date: '',
          max_date: '',
          max_sol: null,
          status: '',
          total_photos: null
        },
        photosForLastDay: null,
        latestImage: null
      }
    },
    computed: {
      ...mapGetters(['allManifestsLoaded']),
      latestImageSrc() {
        const self = this as IManifestComponent;
        return self.latestImage === null ? '' : self.latestImage.img_src
      }
    },
    created() {
      const self = this as IManifestComponent;
      self.getManifest(self.rover);
    },
    methods: {
      async getManifest(rover: Rover) {
        const self = this as IManifestComponent;
        const roverName = Rover[rover].toLowerCase();

        await fetch(`${NASA_API_BASE_URL}/manifests/${roverName}?api_key=${NASA_API_KEY}`)
          .then(response => {
            return response.json()
              .then(data => {
                  self.manifest = data.photo_manifest;
              });
          });

        console.log('just got manifest...');

        await self.getPhotosForLastDay(roverName);
        console.log('just got photos for last day...');

        switch (rover) {
          case Rover.Curiosity:
            this.setManifestLoadedValue('setCuriosityManifestLoadedValue', true);
            console.log('manifest for Curiosity loaded...');
            break;
          case Rover.Opportunity:
            this.setManifestLoadedValue('setOpportunityManifestLoadedValue', true);
            console.log('manifest for Opportunity loaded...');
            break;
          case Rover.Spirit:
            this.setManifestLoadedValue('setSpiritManifestLoadedValue', true);
            console.log('manifest for Spirit loaded...');
            break;
        }
      },
      async getPhotosForLastDay(roverName: string) {
        const self = this as IManifestComponent;

        fetch(`${NASA_API_BASE_URL}/rovers/${roverName}/photos?earth_date=${self.manifest.max_date}&api_key=${NASA_API_KEY}`)
          .then(response => {
            return response.json()
              .then(data => {
                self.photosForLastDay = data.photos;
                self.latestImage = self.photosForLastDay[self.photosForLastDay.length - 1];
              });
        });
      },
      setManifestLoadedValue(action: string, value:boolean) {
        this.$store.dispatch(action, value);
      }
    }
  });
</script>

<style scoped lang="scss">
  @import "src/assets/styles/variables";

  .manifest {
    width: calc(33.33333% - 1rem);
    padding: 1rem;
    background: $color-black-transparent;

    p {
      margin-bottom: 0.25rem;
      font-size: 0.75rem;
    }
  }

  .manifest-heading {
    display: inline-block;
    border-bottom: 2px solid $color-accent;
    margin-bottom: 1rem;
    padding-bottom: 0.25rem;
  }

  .manifest-info {
    display: flex;
    margin-bottom: 0.5rem;

    .heading {
      font-size: 0.85rem;
    }
  }

  .launched, .landed, .status {
    margin-right: 2rem;
  }

  .status p {
    text-transform: capitalize;
  }

  .total-images {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    justify-content: flex-end;
    margin-bottom: 0.5rem;

    .heading {
      .text {
        display: block;
        font-size: 1rem;
      }
    }

    .amount {
      font-size: 2.75rem;
      font-weight: bold;
      margin-right: 0.5rem;
      color: $color-accent;
      margin-bottom: 0;
    }
  }

  .recent-images {
    .images {
      display: flex;
      flex-wrap: wrap;
      width: 100%;

      .image {
        display: flex;
        margin-top: 0.5rem;
        max-width: calc(25.45% - 0.5rem);
        margin-right: 0.5rem;
        border: 1px solid $color-grey;
        cursor: pointer;
        position: relative;

        img {
          width: 100%;
        }

        &:nth-child(4n) {
          margin-right: 0;
        }

        .img-overlay{
          display: none;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgba(0, 0, 0, .1);
        }

        &:hover {
          .img-overlay{
            display: block;
          }
        }
      }
    }
  }

  .manifest-images {
    max-width: 25%;
    display: flex;

    img {
      max-width: 100%;
    }
  }
</style>
