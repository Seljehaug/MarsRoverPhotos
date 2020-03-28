import Vue from 'vue'
import VueRouter from 'vue-router'
import Manifests from '../views/Manifests.vue'
import RoverImages from '../views/RoverImages.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Manifests',
    component: Manifests
  },
  {
    path: '/rover/:id/images',
    name: 'RoverImages',
    component: RoverImages
  }
];

const router = new VueRouter({
  routes
});

export default router
