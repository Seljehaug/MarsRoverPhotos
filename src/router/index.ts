import Vue from 'vue'
import VueRouter from 'vue-router'
import ManifestsComponent from '../views/ManifestsComponent.vue'
import RoverImagesComponent from '../views/RoverImagesComponent.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Manifests',
    component: ManifestsComponent
  },
  {
    path: '/rover/:id/images',
    name: 'RoverImages',
    component: RoverImagesComponent,
    props: (route: any) => {
      const id = parseInt(route.params.id);
      return { id }
    }
  }
];

const router = new VueRouter({
  routes
});

export default router
