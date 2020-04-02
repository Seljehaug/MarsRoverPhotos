<template>
  <div class="rover-images" v-show="manifestLoaded(id) && imagesLoaded">
    <div class="search-settings">
      <div class="date-and-sol-inputs">
        <h2>Search by:</h2>
        <div class="date-settings">
          <div class="input-wrapper">
            <label for="earth-date">Earth date</label>
            <datepicker id="earth-date" v-model="searchDate" format="MMM dsu yyyy" calendar-class="datepicker"></datepicker>
          </div>

          <div class="input-wrapper">
            <label for="sol" class="sol-label">
              <span class="label-text">Sol</span>
              <InfoIcon class="info-icon" v-tooltip="{ content: solTooltip, classes: ['tooltip', 'below'], placement: 'below'}"></InfoIcon>
            </label>
            <input id="sol" type="number">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {NASA_API_KEY} from '../../configuration/API_KEY';
  import {emptyManifest, NASA_API_BASE_URL} from '@/utility';
  import {mapGetters} from 'vuex';
  import {IManifest} from '@/interfaces';
  import {Rover} from '@/enums';
  import Datepicker from 'vuejs-datepicker';
  import InfoIcon from '@/assets/icons/InfoIcon.vue';
  import moment from 'moment';

  interface IRoverImages {
    rover: Rover;
    manifest: IManifest;
    searchDate: string;
    searchSol: string;
    solTooltip: string;
    imagesLoaded: boolean;

    getManifestFromApiOrStore(rover: Rover): void;
    fetchImagesForLastEarthDay(rover: Rover): void;

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
      ...mapGetters(['manifestLoaded', 'getManifest']),
      searchDateFormatted() {
        const self = this as IRoverImages;
        return moment(self.searchDate).format('YYYY-MM-DD');
      }
    },
    data() {
      return {
        rover: -1,
        manifest: emptyManifest,
        searchDate: '',
        searchSol: '',
        solTooltip: '',
        imagesLoaded: false
      }
    },
    async created() {
      const self = this as IRoverImages;
      self.rover = self.id;

      await self.getManifestFromApiOrStore(self.rover);
      await self.fetchImagesForLastEarthDay(self.rover);
      self.searchDate = self.manifest.max_date;
      self.solTooltip = `Should be a number between 0 (landing date) and ${self.manifest.max_sol} (latest available sol with images)`;
      self.imagesLoaded = true;
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
      fetchImagesForLastEarthDay(rover: Rover) {
        const self = this as IRoverImages;
        const roverName = Rover[rover].toLowerCase();
        fetch(`${NASA_API_BASE_URL}/rovers/${roverName}/photos?earth_date=${self.manifest.max_date}&api_key=${NASA_API_KEY}`)
      },
      setManifestLoadedValue(action: string, value:boolean) {
        this.$store.dispatch(action, value);
      }
    },
    components: {
      Datepicker,
      InfoIcon
    }
  });
</script>

<style scoped lang="scss">
  @import "src/assets/styles/variables";

  .search-settings {
    width: 100%;
    background: $color-black-transparent;
    padding: 1rem;

    h2 {
      font-size: 1.25rem;
      display: inline-block;
      margin-bottom: 0.5rem;
      border-bottom: 2px solid #b37168;
      padding-bottom: 5px;
    }

    .date-settings {
      display: flex;
      .input-wrapper:first-child {
        margin-right: 1rem;
      }
    }

    .input-wrapper {
      width: 120px;

      input {
        max-width: 100%;
      }

      label {
        display: block;
        margin-bottom: 0.25em;
      }

      &:not(:last-child) {
        margin-bottom: 0.5rem;
      }
    }

    label.sol-label {
      display: flex;
      align-items: center;
      .label-text {
        margin-right: 0.5rem;
      }

      .info-icon {
        width: 1.1em;
        height: 1.1em;
        fill: $color-accent;
        color: white;
      }
    }
  }
</style>
