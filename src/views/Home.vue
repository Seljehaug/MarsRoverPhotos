<template>
  <div class="home">
    <p>Home</p>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { NASA_API_KEY } from '../../configuration/API_KEY';

  interface IHome {
    curiosityManifest: any;
    opportunityManifest: any;
    spiritManifest: any;

    getManifest(rover: Rovers): void;
  }

  export enum Rovers {
    Curiosity = 0,
    Opportunity = 1,
    Spirit = 2
  }

  export default Vue.extend({
    name: 'Home',
    props: {},
    data() {
      return {
        curiosityManifest: null,
        opportunityManifest: null,
        spiritManifest: null
      }
    },
    mounted() {
      const self = this as IHome;

      self.getManifest(Rovers.Curiosity);
      self.getManifest(Rovers.Opportunity);
      self.getManifest(Rovers.Spirit);
    },
    methods: {
      getManifest(rover: Rovers) {
        const self = this as IHome;
        const roverName = Rovers[rover].toLowerCase();

        fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/${roverName}?api_key=${NASA_API_KEY}`)
          .then(response => {
            return response.json()
              .then(data => {
                switch (rover) {
                  case Rovers.Curiosity: {
                    self.curiosityManifest = data.photo_manifest;
                    break;
                  }
                  case Rovers.Opportunity: {
                    self.opportunityManifest = data.photo_manifest;
                    break;
                  }
                  case Rovers.Spirit: {
                    self.spiritManifest = data.photo_manifest;
                    break;
                  }
                }
              });
          });
      }
    }
  });
</script>

<style scoped lang="scss">

</style>
