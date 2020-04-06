import Vue from 'vue'
import Vuex from 'vuex'
import {emptyManifest} from '@/utility';
import {Camera, Rover} from '@/enums';
import {ICameraData, IManifest} from '@/interfaces';

Vue.use(Vuex);

interface IRoverData {
  rover: Rover;
  manifest: IManifest;
  images: any[];
  availableCameras: ICameraData[];
  selectedCameras: ICameraData[];
}

export default new Vuex.Store({
  state: {
    curiosityManifest: emptyManifest,
    opportunityManifest: emptyManifest,
    spiritManifest: emptyManifest,
    curiosityManifestLoaded: false,
    opportunityManifestLoaded: false,
    spiritManifestLoaded: false,
    availableCameras: [],
    selectedCameras: []
  },
  mutations: {
    setCuriosityManifestLoadedValue(state, value) {
      state.curiosityManifestLoaded = value;
    },
    setOpportunityManifestLoadedValue(state, value) {
      state.opportunityManifestLoaded = value;
    },
    setSpiritManifestLoadedValue(state, value) {
      state.spiritManifestLoaded = value;
    },
    setManifest(state, roverData: IRoverData) {
      switch (roverData.rover) {
        case Rover.Curiosity:
          state.curiosityManifest = roverData.manifest;
          break;
        case Rover.Opportunity:
          state.opportunityManifest = roverData.manifest;
          break;
        case Rover.Spirit:
          state.spiritManifest = roverData.manifest;
          break;
      }
    },
    setAvailableCameras(state, cameras) {
      state.availableCameras = cameras;
    },
    setSelectedCameras(state, cameras) {
      state.selectedCameras = cameras;
    }
  },
  actions: {
    setCuriosityManifestLoadedValue(context, value) {
      context.commit('setCuriosityManifestLoadedValue', value);
    },
    setOpportunityManifestLoadedValue(context, value) {
      context.commit('setOpportunityManifestLoadedValue', value);
    },
    setSpiritManifestLoadedValue(context, value) {
      context.commit('setSpiritManifestLoadedValue', value);
    },
    setManifest(context, roverData: IRoverData) {
      context.commit('setManifest', roverData)
    },
    setAvailableCameras(context, cameras: ICameraData[]) {
      context.commit('setAvailableCameras', cameras);
    },
    setSelectedCameras(context, cameras: ICameraData[]) {
      context.commit('setSelectedCameras', cameras);
    }
  },
  getters: {
    allManifestsLoaded: state => {
      return state.curiosityManifestLoaded && state.opportunityManifestLoaded && state.spiritManifestLoaded;
    },
    manifestLoaded: state => (rover: Rover) => {
      switch (rover) {
        case Rover.Curiosity: return state.curiosityManifestLoaded;
        case Rover.Opportunity: return state.opportunityManifestLoaded;
        case Rover.Spirit: return state.spiritManifestLoaded;
      }
    },
    getManifest: state => (rover: Rover) => {
      switch (rover) {
        case Rover.Curiosity: return state.curiosityManifest;
        case Rover.Opportunity: return state.opportunityManifest;
        case Rover.Spirit: return state.spiritManifest;
      }
    },
    getSelectedCameras: state => {
      const selected: Camera[] = [];

      state.selectedCameras.forEach((camera: ICameraData) => {
        selected.push(camera.id);
      });

      return selected;
    }
  }
})
