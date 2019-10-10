import Vue from 'vue';
import Router from 'vue-router';
import baseArcGISMap from '@/components/map/baseArcGISMap';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'baseArcGISMap',
      component: baseArcGISMap
    }
  ]
});
