import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './assets/styles/global.scss';

import VTooltip from 'v-tooltip'
import PrettyCheckbox from 'pretty-checkbox-vue';
import Datepicker from 'vuejs-datepicker';
import VueLazyload from 'vue-lazyload';

Vue.config.productionTip = false;

Vue.use(require('vue-moment'));
Vue.use(VTooltip);
Vue.use(PrettyCheckbox);
Vue.use(VueLazyload);
Vue.component('datepicker', Datepicker);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
