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
        <router-link :to="{ name: 'RoverImages', params: { id: +rover } }">See all</router-link>
      </h3>
      <p class="amount">{{manifest.total_photos}}</p>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {mapGetters} from 'vuex';
  import {NASA_API_KEY} from '../../configuration/API_KEY';
  import {emptyManifest, NASA_API_BASE_URL} from '@/utility';
  import {Rover} from '@/enums';
  import {IManifest} from '@/interfaces';

  interface IManifestComponent {
    manifest: IManifest;
    photosForLastDay: any;

    getManifestFromApiOrStore(rover: Rover): void;

    // props
    rover: Rover;
  }

  export default Vue.extend({
    name: 'ManifestComponent',
    props: {
      rover: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        manifest: emptyManifest,
        photosForLastDay: null
      }
    },
    computed: {
      ...mapGetters(['allManifestsLoaded', 'getManifest']),
    },
    created() {
      const self = this as IManifestComponent;
      self.getManifestFromApiOrStore(self.rover);
    },
    methods: {
      async getManifestFromApiOrStore(rover: Rover) {
        const self = this as IManifestComponent;
        const roverName = Rover[rover].toLowerCase();

        // manifest has been already loaded => fetch from store
        if(this.allManifestsLoaded) {
          self.manifest = this.getManifest(rover);
          return;
        }

        await fetch(`${NASA_API_BASE_URL}/manifests/${roverName}?api_key=${NASA_API_KEY}`)
          .then(response => {
            return response.json()
              .then(data => {
                  self.manifest = data.photo_manifest;
                  // save manifest to store
                  this.$store.dispatch('setManifest', {rover: rover, manifest: data.photo_manifest});
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
        margin-bottom: 2px;
      }
    }

    .amount {
      font-size: 3rem;
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
