<template>
  <div id="app">
    <h2 id="title">{{ msg }}</h2>
    <router-view />
  </div>
</template>

<script>

import Nav from './components/Nav';
import esriLoader from 'esri-loader';
import { ServiceUrl } from './components/ServiceUrl';

export default {
  name: 'App',
  components: {
    Nav
  },
  data() {
    return {
      msg: 'MyMaps By Arcgis for JavaScript 4.10',
      navData: [
        { route: '/', name: '加载底图' },
        { route: '/tileLayer', name: '瓦片图层' },
        { route: '/featureLayer', name: '要素图层' }
      ]
    };
  },
  created() {
    // // 加载js
    // esriLoader.loadScript({url: ServiceUrl.apiUrl});
    // 加载css
    esriLoader.loadCss(ServiceUrl.cssUrl);
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#title {
  text-align: center;
  margin-top: 10px;
}
</style>
