import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    curiosityManifestLoaded: false,
    opportunityManifestLoaded: false,
    spiritManifestLoaded: false
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
    }
  },
  getters: {
    allManifestsLoaded: state => {
      return state.curiosityManifestLoaded && state.opportunityManifestLoaded && state.spiritManifestLoaded;
    }
  },
  modules: {
  }
})
