<template>
  <div class="search-bar">
    <div class="search-settings">
      <div class="date-and-sol-settings">
        <h2 class="heading">Use:</h2>
        <div class="switch">
          <label for="earth-date" class="switch-label earth-label" @click="searchByEarthDate = true">Earth date</label>
          <p-check class="p-switch" v-model="searchByEarthDate"></p-check>
          <label for="sol" class="switch-label sol-label" @click="searchByEarthDate = false">Mars sol <InfoIcon class="info-icon" v-tooltip="{ content: solTooltip, classes: ['tooltip', 'below'], placement: 'below'}"></InfoIcon></label>
        </div>

        <div class="content">

          <div class="input-wrapper">
            <datepicker v-show="searchByEarthDate" id="earth-date" v-model="searchDate" format="MMM dsu yyyy" calendar-class="datepicker"></datepicker>
            <input v-show="searchByEarthDate === false" id="sol" type="number" v-model="searchSol" v-on:keyup.enter="search">
          </div>

          <button class="search-button" @click="search">Search</button>
          <button class="toggle-cameras-button">
            Cameras
            <!-- TODO Change to arrow-down class, rotate arrow -->
            <span class="arrow arrow-down">&darr;</span>
          </button>
        </div>

        <div class="divider"></div>
      </div>

      <div class="camera-settings">
        <h2 class="heading">
          Cameras:
          <InfoIcon class="info-icon" v-tooltip="{ content: camerasTooltip, classes: ['tooltip', 'below'], placement: 'below'}"></InfoIcon>
        </h2>

        <div class="content">
          <div class="camera" v-for="(camera, index) in availableCameras" :key="index">
            <p-check class="p-default" :value="camera" v-model="selectedCameras">
              <span class="label-text">{{camera.name}}</span>
            </p-check>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
  import Vue from 'vue';
  import moment from 'moment';
  import {IManifest} from '@/interfaces';
  import {Camera, Rover} from '@/enums';
  import Datepicker from 'vuejs-datepicker';
  import {getCamerasForRover} from '@/utility';
  import InfoIcon from '@/assets/icons/InfoIcon.vue';

  interface ISearchBar {
    searchDate: string;
    searchSol: string;
    solTooltip: string;
    camerasTooltip: string;
    availableCameras: {id: Camera, name: string, fullName: string}[];
    selectedCameras: {id: Camera, name: string, fullName: string}[];
    searchByEarthDate: boolean;
    $emit: any;

    createTooltips(): void;
    search(): void;

    // Props
    rover: Rover;
    manifest: IManifest;
  }

  export default Vue.extend({
    name: 'SearchBarComponent',
    props: {
      rover: {
        type: Number as () => Rover,
        required: true
      },
      manifest: {
        type: Object as () => IManifest,
        required: true
      }
    },
    data() {
      return {
        searchDate: '',
        searchSol: '',
        solTooltip: '',
        camerasTooltip: '',
        availableCameras: [],
        selectedCameras: [],
        searchByEarthDate: true
      }
    },
    computed: {
      searchDateFormatted() {
        const self = this as ISearchBar;
        return moment(self.searchDate).format('YYYY-MM-DD');
      }
    },
    async created() {
      const self = this as ISearchBar;

      self.availableCameras = getCamerasForRover(self.rover);
      self.selectedCameras = getCamerasForRover(self.rover);

      await this.$store.dispatch('setAvailableCameras', self.availableCameras);
      await this.$store.dispatch('setSelectedCameras', self.selectedCameras);

      self.searchDate = self.manifest.max_date;

      self.createTooltips();

      self.$emit('search', { searchByEarthDate: self.searchByEarthDate, query: self.searchDate});
    },
    methods: {
      async search() {
        const self = this as ISearchBar;
        await this.$store.dispatch('setSelectedCameras', self.selectedCameras);

        const query = self.searchByEarthDate ? this.searchDateFormatted : self.searchSol;
        self.$emit('search', { searchByEarthDate: self.searchByEarthDate, query: query});
      },
      createTooltips() {
        const self = this as ISearchBar;

        self.solTooltip = `Should be a number between 0 (time of landing) and ${self.manifest.max_sol} (latest available sol with images)`;

        let camerasTooltipText = '';
        self.availableCameras.forEach(camera => {
          camerasTooltipText += `<p><b>${camera.name}:</b> ${camera.fullName}</p>`
        });
        self.camerasTooltip = camerasTooltipText;
      },
    },
    components: {
      Datepicker,
      InfoIcon,
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

      .earth-label, .sol-label .info-icon {
        margin-left: 0.25rem;
      }

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

        /*.input-wrapper:first-child {
          margin-left: 1rem;
          margin-right: 1rem;
          height: 100%;
          width: 2px;
          background-color: $color-accent;
        }*/
      }

      /*&::after {
        content: '';
        height: 100%;
        width: 2px;
        background-color: $color-accent;
        margin-right: 1rem;
      }*/
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

    button, input {
      align-self: center;
      margin-left: 1rem;
      height: 27px;
    }

    .toggle-cameras-button {
      display: none;
      background-color: #616161;
    }

    .divider {
      margin-left: 1rem;
      margin-right: 1rem;
      background-color: $color-accent;
      height: 100%;
      width: 2px;
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
        top: 2px;
        margin-left: 0.5rem;
      }
    }
  }

  @media only screen and (max-width: 700px) {
    .search-settings {
      flex-wrap: wrap;

      .divider {
        display: none;
      }

      .date-and-sol-settings, .camera-settings {
        width: 100%;
      }

      .date-and-sol-settings {
        flex-wrap: wrap;

        .info-icon {
          margin-left: 0.25rem;
        }

        .content {
          margin-top: 0.5rem;
          margin-left: 0;
        }
      }

      .toggle-cameras-button {
        display: block;
      }

      button, input {
        font-size: 0.75rem;
      }

      button {
        margin-left: 0.5rem;
      }

      input {
        margin-left: 0;
      }

      #sol, .input-wrapper {
        width: 100px;
      }
    }

    .camera-settings {
      margin-top: 0.5rem;
      flex-wrap: wrap;

      .heading .info-icon {
        top: 0;
      }
    }
  }
</style>
