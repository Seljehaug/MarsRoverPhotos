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
        <span class="amount">{{manifest.total_photos}}</span> <span>images</span>
      </h3>
      <router-link :to="{ name: 'RoverImages', params: { id: +rover } }" class="link">See all</router-link>
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

  .launched, .landed {
    margin-right: 2rem;
  }

  .status p {
    text-transform: capitalize;
  }

  .total-images {
    font-size: 1rem;

    .heading {
      font-size: 1rem;
    }

    .link {
      font-weight: bold;
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

  @media only screen and (max-width: 1200px) {
    .launched, .landed {
      margin-right: 1rem;
    }
  }

  @media only screen and (max-width: 1000px) {
    .manifest-heading {
      font-size: 1.5rem;
    }

    .launched, .landed {
      margin-right: 0;
      margin-bottom: 0.5rem;
    }

    .manifest-info {
      flex-wrap: wrap;
      > div {
        width: 100%;
      }
    }
  }

  @media only screen and (max-width: 700px) {
    .manifest-heading {
      font-size: 1.35rem;
    }
  }

  @media only screen and (max-width: 600px) {
    .manifest {
      width: 100%;
      margin-bottom: 1rem;
    }

    .manifest-info {
      > div {
        width: auto;
      }
    }

    .launched, .landed {
      margin-right: 2rem;
    }
  }

  @media only screen and (max-width: 480px) {
    .launched, .landed {
      margin-right: 1rem;
    }
  }
</style>
