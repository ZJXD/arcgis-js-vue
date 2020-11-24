import esriLoader from "esri-loader";
import { GetLayers } from "./getCustomMap";
import { ServiceUrl } from '../ServiceUrl';
import SomeMethods from "./tools";

const gisModules = [
  "esri/Map",
  "esri/views/MapView",
  "esri/views/SceneView",
  "esri/Basemap",
  "esri/geometry/SpatialReference",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",
  "esri/geometry/geometryEngine",
  "esri/geometry/Extent",
  "esri/geometry/support/webMercatorUtils",
  "esri/Graphic",
  "esri/symbols/PictureMarkerSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/TextSymbol",
  "esri/layers/GraphicsLayer",
  "esri/layers/MapImageLayer",
  "esri/layers/TileLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/BaseTileLayer",
  "esri/layers/WebTileLayer",
  "esri/layers/support/TileInfo",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/widgets/Sketch/SketchViewModel",
  "esri/widgets/Sketch",
  "esri/widgets/ScaleBar",
  "esri/widgets/Measurement",
  "dojo/dom",
  "dojo/on",
  "dojo/dom-construct",
  "dojo/query",
  "customMap/BDLayer",
  "customMap/CustomBaseMap",
  "dojo/domReady!"
];

/**
 * ArcGISMap 类
 */
class ArcGISMap {
  constructor(containerId, options) {
    this.options = {};
    this.gisAPI = {};
    this.map = null;
    this.mapview = null;
    this.layers = [];
    this.graphics = [];
    this.graphicsLayers = {};
    this.customBaseLayer = {};
    this.viewConfig = {
      mapView: null,
      sceneView: null,
      activeView: null,
      container: containerId
    };

    this.tools = null;

    this.initOptions(options);
    this.initMap();
  }

  /**
   * 初始化一些参数
   * @param {*} options
   */
  initOptions(options) {
    if (options && options.center) {
      this.options.center = options.center;
    }
    if (options && options.zoom) {
      this.options.zoom = options.zoom;
    }
    if (options && options.gisModules) {
      this.options.gisModules = options.gisModules;
    } else {
      this.options.gisModules = gisModules;
    }
    if (options && options.sketch) {
      this.options.sketch = options.sketch;
    } else {
      this.options.sketch = true;
    }
  }

  /**
   * 地图初始化工作
   */
  async initMap() {
    await this.loadAPI();
    this.createMap();

    this.tools = new SomeMethods(this.mapview, this.gisAPI);
  }

  /**
   * 加载模块
   */
  loadAPI() {
    // let packagePath = '/';
    return new Promise((resolve, reject) => {
      esriLoader
        .loadModules(this.options.gisModules, {
          url: ServiceUrl.apiUrl,
          // url: "https://192.168.1.216:8083/init.js",
          dojoConfig: {
            async: true,
            tlmSiblingOfDojo: false,
            packages: [
              {
                name: "customMap",
                // location: location.pathname.replace(/\/[^/]+$/, '') + '/customMap'
                location: "/static/customMap"
              }
            ]
          }
        })
        .then(args => {
          for (const k in args) {
            const name = this.options.gisModules[k].split("/").pop();
            this.gisAPI[name] = args[k];
          }
          resolve();
        });
    });
  }

  /**
   * 创建地图、视图等
   */
  createMap() {
    this.customBaseLayer = GetLayers(this.gisAPI);

    this.map = new this.gisAPI.Map({
      // basemap: 'satellite'
      basemap: new this.gisAPI.Basemap({
        baseLayers: [this.customBaseLayer.LAYER_GOOGLE]
      })
    });

    const initialViewParams = {
      map: this.map,
      zoom: this.options.zoom ? this.options.zoom : 12,
      center: this.options.center ? this.options.center : [120.06, 30.2],
      container: this.viewConfig.container
    };

    this.viewConfig.mapView = this.createView(initialViewParams, "2d");
    this.viewConfig.activeView = this.viewConfig.mapView;
    this.mapview = this.viewConfig.activeView;
    initialViewParams.container = null;
    this.viewConfig.sceneView = this.createView(initialViewParams, "3d");

    // 不切换视图的时候声明用
    // this.mapview = new this.gisAPI.MapView({
    //   container: this.containerId,
    //   map: this.map,
    //   center: this.options.center ? this.options.center : [120.06, 30.2],
    //   zoom: this.options.zoom ? this.options.zoom : 12
    // });

    // 添加工具栏
    if (this.options.sketch) {
      const graphicsLayer = new this.gisAPI.GraphicsLayer();
      const sketch = new this.gisAPI.Sketch({
        view: this.mapview,
        layer: graphicsLayer
      });
      this.mapview.ui.add(sketch, "top-right");
      this.map.add(graphicsLayer);
    }

    // 添加测距
    const measurement = new this.gisAPI.Measurement({
      view: this.mapview,
      activeTool: 'distance',
      linearUnit: "metric"
    })
    this.mapview.ui.add(measurement, 'bottom-right')

    // 添加比例尺
    const scaleBar = new this.gisAPI.ScaleBar({
      view: this.mapview,
      unit: "metric"
    });
    this.mapview.ui.add(scaleBar, {
      position: "bottom-left"
    });
  }

  /**
   * 创建视图
   * @param {Object} params
   * @param {String} type
   */
  createView(params, type) {
    let view;
    const is2D = type === "2d";
    if (is2D) {
      view = new this.gisAPI.MapView(params);
      return view;
    } else {
      view = new this.gisAPI.SceneView(params);
    }
    return view;
  }

  /**
   * 2D-3D切换
   */
  switchView() {
    const is3D = this.viewConfig.activeView.type === "3d";
    if (is3D) {
      this.viewConfig.mapView.viewpoint = this.viewConfig.activeView.viewpoint.clone();
      this.viewConfig.mapView.container = this.viewConfig.container;
      this.viewConfig.sceneView.container = null;
      this.viewConfig.activeView = this.viewConfig.mapView;
    } else {
      this.viewConfig.sceneView.viewpoint = this.viewConfig.activeView.viewpoint.clone();
      this.viewConfig.sceneView.container = this.viewConfig.container;
      this.viewConfig.mapView.container = null;
      this.viewConfig.activeView = this.viewConfig.sceneView;
    }

    this.mapview = this.viewConfig.activeView;

    // this.tools = new SomeMethods(this.mapview, this.gisAPI);
  }

  /**
   * 创建图层
   * @param {array} layerInfos
   */
  createTileLayer(layerInfos) {
    const tileLayer = layerInfos.map(item => {
      return new this.gisAPI.TileLayer({
        id: item.id,
        url: item.url
      });
    });
    return tileLayer;
  }

  /**
   * 更换 BaseMap
   * @param {any} layer layer数组或者默认的一些 Id
   */
  changeBaseMap(layer) {
    if (layer instanceof Array) {
      this.map.basemap = new this.gisAPI.Basemap({
        baseLayers: layer
      });
    }
    if (typeof layer === "string") {
      if (layer === "BDMap") {
        this.map.basemap = new this.gisAPI.Basemap({
          baseLayers: this.customBaseLayer.LAYER_BD
        });
      } else if (layer === "GDMap") {
        this.map.basemap = new this.gisAPI.Basemap({
          baseLayers: this.customBaseLayer.LAYER_GD
        });
      } else if (layer === "GDSATMap") {
        this.map.basemap = new this.gisAPI.Basemap({
          baseLayers: [
            this.customBaseLayer.LAYER_GDSAT,
            this.customBaseLayer.LAYER_GD_ANNO
          ]
        });
      } else if (layer === "TDTMap") {
        this.map.basemap = new this.gisAPI.Basemap({
          baseLayers: [
            this.customBaseLayer.LAYER_TDTVEC,
            this.customBaseLayer.LAYER_TDTVEC_ANNO
          ]
        });
      } else if (layer === "GoogleMap") {
        this.map.basemap = new this.gisAPI.Basemap({
          baseLayers: [this.customBaseLayer.LAYER_GOOGLE]
        });
      } else if (layer === "GoogleSatMap") {
        this.map.basemap = new this.gisAPI.Basemap({
          baseLayers: [this.customBaseLayer.LAYER_GOOGLESAT]
        });
      } else {
        this.map.basemap = layer;
      }
    }
  }

  /**
   * 根据标识获取图层，不包含 BaseLayer
   * @param {string} layerId 图层标识
   */
  findLayerById(layerId) {
    return this.map.findLayerById(layerId);
  }

  /**
   * 添加样式符号
   * @param {Symbol} symbol 样式定义
   * @param {Geometry} geometry 要素
   * @param {Class} attributes 属性信息
   */
  addSymbol(symbol, geometry, attributes) {
    const graphic = new this.$gisAPI.Graphic(geometry, symbol, attributes);

    this.graphics.push(graphic);
  }

  /**
   * 根据类型创建 symbol
   * @param {string} type 创建的类型
   * @param {*} options 所需的参数
   */
  // createSymbol(type, options) {
  //   switch (type) {
  //     case 'simple':
  //       new this.gisAPI.SimpleFillSymbol(options);
  //       break;
  //     case 'picture':
  //       new this.gisAPI.PictureMarkerSymbol(options);
  //     default:
  //       break;
  //   }
  // }

  /**
   * 点击画要素
   * @param {string} type
   * }
   */
  drawGra(type) {
    let layer = null;
    if (this.graphicsLayers[type]) {
      layer = this.graphicsLayers[type];
      // this.tools.clearGraLayer(layer);
    } else {
      layer = this.tools.creatGraLayer({ layerName: type + "Layer" });
      this.graphicsLayers[type] = layer;
    }
    this.tools.drawGra({ type: type, layer: layer });
  }

  /**
   * 清空所有图层
   */
  clearAllGraLayer() {
    Object.keys(this.graphicsLayers).forEach(l => {
      this.graphicsLayers[l].removeAll();
    });
  }
}

export default ArcGISMap;
