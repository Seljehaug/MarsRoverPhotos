import {RoverType} from "@/enums/enums";
<template>
  <div class="manifest" v-if="allManifestsLoaded">
    <h2 class="manifest-heading">{{manifest.name}}</h2>
    <p>Launched: {{manifest.launch_date}}</p>
    <p>Landed: {{manifest.landing_date}}</p>
    <p>Status: {{manifest.status}}</p>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import {mapGetters} from "vuex";
  import {NASA_API_KEY} from "../../configuration/API_KEY";
  import {RoverType} from "@/enums/enums";

  interface IManifestComponent {
    manifest: IManifest;

    // props
    rover: RoverType;

    getManifest(rover: RoverType): void;
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
        loaded: false,
        manifest: {
          name: '',
          landing_date: '',
          launch_date: '',
          max_date: '',
          max_sol: null,
          status: '',
          total_photos: null
        }
      }
    },
    computed: {
      ...mapGetters(['allManifestsLoaded'])
    },
    created() {
      const self = this as IManifestComponent;
      self.getManifest(self.rover);
    },
    methods: {
      getManifest(rover: RoverType) {
        const self = this as IManifestComponent;
        const roverName = RoverType[rover].toLowerCase();

        fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}?api_key=${NASA_API_KEY}`)
          .then(response => {
            return response.json()
              .then(data => {
                  self.manifest = data.photo_manifest;

                  switch (rover) {
                    case RoverType.Curiosity:
                      this.setManifestLoadedValue('setCuriosityManifestLoadedValue', true);
                      break;
                    case RoverType.Opportunity:
                      this.setManifestLoadedValue('setOpportunityManifestLoadedValue', true);
                      break;
                    case RoverType.Spirit:
                      this.setManifestLoadedValue('setSpiritManifestLoadedValue', true);
                      break;
                  }
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
    }
  }

  .manifest-heading {
    display: inline-block;
    border-bottom: 2px solid $color-accent;
    margin-bottom: 1rem;
    padding-bottom: 0.25rem;
  }
</style>
