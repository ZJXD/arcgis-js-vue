<template>
  <div class="hello">
    <div class="mapSource">
      地图源：
      <!-- <button class="baseMap" v-for="baseMap in baseMaps" :key="baseMap" @click="changeBaseMap(baseMap)">{{baseMap}}</button> -->
      <el-select v-model="selectValue" placeholder="请选择" @change="changeBaseMap(selectValue)">
        <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div ref="baseMap" :id="mapid" class="map">
      <button class="switchViewBtn" title="点击切换视图" @click="switchView">{{ viewValue }}</button>
      <div class="swithcShowDiv">
        <button :class="swithcShowClass" title="隐藏显示工具栏" @click="switchShow" />
      </div>
      <div v-show="toolBoxShow" class="toolBox">
        <button v-for="item in toolButton" :key="item.id" :class="[item.name , {selected:isChange === item.id}]" :title="item.title" @click="toolClick(item.id)" />
      </div>
      <div class="distance">
        <button>测量</button>
        <button>清除</button>
      </div>
    </div>
  </div>
</template>

<script>
import ArcGISMap from './arcgisMap';

const gisModules = [
  'esri/Map',
  'esri/views/MapView',
  'esri/views/SceneView',
  'esri/Basemap',
  'esri/layers/TileLayer',
  'esri/layers/GraphicsLayer',
  'esri/layers/BaseTileLayer',
  'esri/geometry/Point',
  'esri/geometry/Polygon',
  'esri/Graphic',
  'esri/request',
  'esri/widgets/Sketch',
  'esri/widgets/Sketch/SketchViewModel',
  'esri/widgets/ScaleBar',
  "esri/widgets/Measurement",
  'esri/geometry/Extent',
  'dojo/dom',
  'dojo/on',
  'dojo/dom-construct',
  'dojo/query',
  'customMap/BDLayer',
  'customMap/CustomBaseMap',
  'dojo/domReady!'
];

export default {
  name: 'ArcGISMap',
  data() {
    return {
      isChange: -1,
      toolButton: [
        { id: 1, name: 'tooladd', title: '添加' },
        { id: 2, name: 'toolpoint', title: '画点' },
        { id: 3, name: 'toolpolyline', title: '画线' },
        { id: 4, name: 'toolpolygon', title: '画面' },
        { id: 5, name: 'fa fa-stop', title: '画长方形' },
        { id: 6, name: 'fa fa-circle-thin', title: '画圆' },
        { id: 100, name: 'fa fa-eraser', title: '清理图层' }
      ],
      toolBoxShow: false,
      swithcShowClass: 'swithcShow show',
      gisMap: null,
      mapid: null,
      layerId: 0,
      tileLayer: null,
      baseMaps: ['topo', 'streets', 'satellite', 'hybrid', 'dark-gray', 'gray', 'national-geographic', 'oceans', 'osm', 'terrain',
        'dark-gray-vector', 'gray-vector', 'streets-vector', 'streets-night-vector', 'streets-navigation-vector', 'topo-vector', 'streets-relief-vector',
        'BDMap', 'GDMap', 'GDSATMap', 'TDTMap', 'GoogleMap', 'GoogleSatMap'],
      selectOptions: [{
        value: 'GoogleMap',
        label: '谷歌地图'
      }, {
        value: 'GoogleSatMap',
        label: '谷歌卫星图'
      }, {
        value: 'BDMap',
        label: '百度地图'
      }, {
        value: 'GDMap',
        label: '高德地图'
      }, {
        value: 'GDSATMap',
        label: '高德卫星图'
      }, {
        value: 'TDTMap',
        label: '天地图'
      }, {
        value: 'topo',
        label: 'topo'
      }, {
        value: 'streets',
        label: 'streets'
      }, {
        value: 'satellite',
        label: 'satellite'
      }, {
        value: 'hybrid',
        label: 'hybrid'
      }, {
        value: 'dark-gray',
        label: 'dark-gray'
      }, {
        value: 'gray',
        label: 'gray'
      }, {
        value: 'national-geographic',
        label: 'national-geographic'
      }, {
        value: 'oceans',
        label: 'oceans'
      }, {
        value: 'osm',
        label: 'osm'
      }, {
        value: 'terrain',
        label: 'terrain'
      }, {
        value: 'dark-gray-vector',
        label: 'dark-gray-vector'
      }, {
        value: 'gray-vector',
        label: 'gray-vector'
      }, {
        value: 'streets-vector',
        label: 'streets-vector'
      }, {
        value: 'streets-night-vector',
        label: 'streets-night-vector'
      }, {
        value: 'streets-navigation-vector',
        label: 'streets-navigation-vector'
      }, {
        value: 'streets-relief-vector',
        label: 'streets-relief-vector'
      }],
      selectValue: '',
      viewValue: '3D'
    };
  },
  created() {
    this.mapid = 'map_' + Math.random().toString(36).substr(2, 9);
  },
  mounted() {
    this.inintMap();
  },
  methods: {
    inintMap() {
      const options = {
        gisModules: gisModules
      };
      this.gisMap = new ArcGISMap(this.mapid, options);
    },

    changeBaseMap(mapId) {
      this.gisMap.changeBaseMap(mapId);
    },

    switchView() {
      if (this.viewValue === '2D') {
        this.viewValue = '3D';
      } else {
        this.viewValue = '2D';
        this.toolBoxShow = false;
        this.swithcShowClass = 'swithcShow show';
        this.isChange = -1;
      }
      this.gisMap.switchView();
    },

    switchShow() {
      if (this.viewValue === '2D') {
        return;
      }
      this.toolBoxShow = !this.toolBoxShow;
      if (this.toolBoxShow) {
        this.swithcShowClass = 'swithcShow hide';
        this.isChange = -1;
      } else {
        this.swithcShowClass = 'swithcShow show';
      }
    },

    toolClick(id) {
      if (id !== this.isChange) {
        this.isChange = id;
      } else {
        this.isChange = -1;
      }

      if (id === 2) {
        this.gisMap.drawGra('point');
      } else if (id === 3) {
        this.gisMap.drawGra('polyline');
      } else if (id === 4) {
        this.gisMap.drawGra('polygon');
      } else if (id === 5) {
        this.gisMap.drawGra('rectangle');
      } else if (id === 6) {
        this.gisMap.drawGra('circle');
      } else if (id === 100) {
        this.gisMap.clearAllGraLayer();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.mapSource {
  margin: 0 0 5px 10px;
}
.map {
  height: 90vh;
  width: 100vw;
  position: fixed;
  bottom: 0px;

  .switchViewBtn {
    position: absolute;
    left: 55px;
    top: 15px;
    width: 32px;
    height: 32px;
  }

  .swithcShowDiv {
    position: absolute;
    right: 15px;
    top: 70px;
    background: white;
    padding: 6px 7px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    .swithcShow {
      align-items: center;
      background-color: transparent;
      color: #6e6e6e;
      display: flex;
      font-size: 16px;
      justify-content: center;
      text-align: center;
      transition: background-color 125ms ease-in-out;
      width: 32px;
      height: 32px;
      border: none;
      outline: none;
    }
    .show {
      &::before {
        font-size: 22px;
        content: '\00AB';
      }
    }
    .hide {
      &::before {
        font-size: 22px;
        content: '\00BB';
      }
    }
    :hover {
      background-color: #f0f0f0;
      color: #2e2e2e;
      cursor: pointer;
      outline: none;
    }
  }

  .toolBox {
    display: flex;
    position: absolute;
    right: 69px;
    top: 70px;
    background: white;
    padding: 6px 7px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    button {
      align-items: center;
      background-color: transparent;
      color: #6e6e6e;
      display: flex;
      font-size: 16px;
      justify-content: center;
      text-align: center;
      transition: background-color 125ms ease-in-out;
      width: 32px;
      height: 32px;
      border: none;
      outline: none;
    }
    :hover {
      background-color: #f0f0f0;
      color: #2e2e2e;
      cursor: pointer;
      outline: none;
    }

    .selected {
      background: #4c4c4c;
      color: #fff;
    }
    .tooladd {
      &::before {
        font-size: 22px;
        content: '\00BB';
      }
    }
    .toolpolyline {
      &::before {
        font-size: 22px;
        content: '\21AD';
      }
    }
    .toolpoint {
      &::before {
        font-size: 22px;
        content: '\2722';
      }
    }
    .toolpolygon {
      &::before {
        font-size: 22px;
        content: '\2610';
      }
    }
    .toolrectangle {
      &::before {
        font-size: 22px;
        content: '\25A3';
      }
    }
    .toolcircle {
      &::before {
        font-size: 22px;
        content: '\2764';
      }
    }
  }

  .distance {
    display: flex;
    position: absolute;
    right: 15px;
    top: 120px;
    background: white;
    padding: 6px 7px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    button {
      align-items: center;
      background-color: transparent;
      color: #6e6e6e;
      font-size: 14px;
      transition: background-color 125ms ease-in-out;
      border: 1px solid #333;
      border-radius: 5px;
      padding: 5px 15px;
      margin: 5px;
      // outline: none;
      cursor: pointer;
    }
  }
}

.baseMap {
  padding: 2px;
  margin: 5px;
}
</style>
