/**
 * 添加删除等各类方法的工具集
 */
import trans from "./transCoords.js";

const EARTH_RADIUS = 6378137; // 赤道半径

class SomeMethods {
  constructor(mapview, $GisApi) {
    this.mapview = mapview || null;
    this.$GisApi = $GisApi || null;
    this.pointSymbol = {
      type: "simple-marker",
      style: "circle",
      color: "#8A2BE2",
      size: "10px",
      outline: {
        color: [255, 255, 255],
        width: 2
      }
    };
    this.polylineSymbol = {
      type: "simple-line",
      color: "#8A2BE2",
      width: "2",
      style: "dash"
    };

    this.polygonSymbol = {
      type: "simple-fill",
      color: "rgba(138,43,226, 0.8)",
      outline: {
        color: "white",
        style: "solid",
        width: 1
      }
    };

    // 点击时上一个选中图标样式
    this.activeFlag = null;
  }

  /**
   * 创建点的图标
   * @param { config.isPic } Boolean 必须，是否为图片类型的图标
   * @param { config.url } String 如果isPic为true则必须，图片的路径
   * @param { config.width } String 非必须，图标的宽度，'8px'
   * @param { config.height } String 非必须，图片的路径,'8px'
   * @param { config.pointColor } String 非必须，普通点的颜色,'#8A2BE2'
   * @param { config.pointSize } String 非必须，普通点的大小,'10px'
   * @return { pointSymbol } Object GraphicsLayer
   */
  creatPointPicSymbol(config) {
    let pointSymbol = {};
    if (config.isPic) {
      pointSymbol = {
        type: "picture-marker",
        url: config.url,
        width: config.width || "8px",
        height: config.height || "8px"
      };
    } else {
      pointSymbol = {
        type: "simple-marker",
        style: "circle",
        color: config.pointColor || "#8A2BE2",
        size: config.pointSize || "10px",
        outline: {
          color: [255, 255, 255],
          width: 2
        }
      };
    }
    return pointSymbol;
  }

  /**
   * 创建一个graphicLayer
   * @param { data.id } String 图层id
   * @param { data.layerName } String 图层名称
   * @return { graLayer } Object GraphicsLayer
   */
  creatGraLayer(data) {
    const graLayer = new this.$GisApi.GraphicsLayer({
      id: data.id || "graLayer_" + Math.ceil(Math.random() * 9999),
      layerName: data.layerName || ""
    });
    this.mapview && this.mapview.map && this.mapview.map.add(graLayer);
    return graLayer;
  }

  /**
   * 传入坐标添加一个点/线/面
   * @param { config.type } String 必要，要添加的类型
   * @param { config.coords } Array 必要，经纬度坐标数组,点--[120,30],线/面--[[120,30],[120,30],[120,30]]
   * @param { config.isAdd } Boolean 必要，是否添加
   * @param { config.layer } Object isAdd为true时必要，GraphicsLayer,图形要添加到的图层
   * @param { config.symbol } Object 非必要，图形的样式
   * @param { config.attrs } Object 非必要，图形的属性
   * @return { graphic } Object Graphic,图形
   */
  addGraByPoints(config) {
    let geo = {};
    switch (config.type) {
      case "point":
        geo = {
          type: "point",
          longitude: config.coords[0],
          latitude: config.coords[1]
        };
        break;
      case "polyline":
        geo = {
          type: "polyline",
          paths: config.coords
        };
        break;
      case "polygon":
        geo = {
          type: "polygon",
          rings: config.coords
        };
        break;
    }
    const graphic = new this.$GisApi.Graphic({
      geometry: geo,
      symbol: config.symbol || this[config.type + "Symbol"],
      attributes: config.attrs || {}
    });

    if (config.isAdd) config.layer.add(graphic);
    return graphic;
  }

  /**
   * 点击地图添加点/线/面
   * @param config[Object] = {
   *   type[String]:  必要,要添加的类型,
   *   symbol[Object]: 非必要,图形的样式
   *   layer[Object]: 必要,GraphicsLayer,图形要添加到的图层
   *   drawEnd[Function]: 非必要,绘制完成的回调，参数为所绘制的坐标
   *   clearLayer[Boolean]: 非必要,是否清空绘制图层
   * }
   */
  drawGra(config) {
    const sketchViewModel = new this.$GisApi.SketchViewModel({
      view: this.mapview,
      layer: config.layer,
      pointSymbol:
        config.symbol && config.symbol.pointSymbol
          ? config.symbol.pointSymbol
          : this.pointSymbol,
      polylineSymbol:
        config.symbol && config.symbol.polylineSymbol
          ? config.symbol.polylineSymbol
          : this.polylineSymbol,
      polygonSymbol:
        config.symbol && config.symbol.polygonSymbol
          ? config.symbol.polygonSymbol
          : this.polygonSymbol
    });
    sketchViewModel.create(config.type, {
      mode: "click"
    });
    sketchViewModel.on("draw-complete", evt => {
      config.clearLayer && config.layer.removeAll();
      const geo = evt.geometry.spatialReference.isWebMercator
        ? this.$GisApi.webMercatorUtils.webMercatorToGeographic(evt.geometry)
        : evt.geometry;
      let symbol = this[config.type + "Symbol"];
      if (config.symbol && config.symbol[config.type + "Symbol"]) {
        symbol = config.symbol[config.type + "Symbol"];
      }
      const graphic = new this.$GisApi.Graphic({
        geometry: geo,
        symbol: symbol
      });
      config.layer.add(graphic);
      let coords = [];
      if (geo.rings) coords = geo.rings[0];
      if (geo.paths) coords = geo.paths[0];
      if (geo.longitude && geo.latitude) coords = [geo.longitude, geo.latitude];
      config.drawEnd &&
        config.drawEnd({
          coords: coords,
          graphic: graphic
        });
    });
  }

  /**
   *  清空GraphicLayer上所有的图形
   * @param layer [Object] 必要,GraphicsLayer,需要清空的图层
   */
  clearGraLayer(layer) {
    layer.removeAll();
  }

  /**
   *  清除GraphicLayer上某个图形
   * @param layer [Object] 必要,GraphicsLayer,需要清空的图层
   * @param fieldName [String] 必要， 删除关键字段key,
   * @param fieldValue [String] 必要， 删除关键字值value
   */
  async removeOneGra(layer, fieldName, fieldValue) {
    const graphic = await layer.graphics.find(gra => {
      if (gra.attributes["checked"]) {
        return true;
      } else {
        return gra.attributes[fieldName] === fieldValue;
      }
    });
    layer.remove(graphic);
  }

  /**
   *  判断一个图形是否在另外一个图形内
   * @param containerGeometry [Object] 必要,Graphic,容器图形
   * @param insideGeometry [Object] 必要,Graphic,需要检测的图形
   */
  isInside(containerGeometry, insideGeometry) {
    const containGeo = containerGeometry.spatialReference.isWebMercator
      ? this.$GisApi.webMercatorUtils.webMercatorToGeographic(containerGeometry)
      : containerGeometry;
    const insideGeo = insideGeometry.spatialReference.isWebMercator
      ? this.$GisApi.webMercatorUtils.webMercatorToGeographic(insideGeometry)
      : insideGeometry;

    return this.$GisApi.geometryEngine.contains(containGeo, insideGeo);
  }

  /**
   *  高亮显示某一个图形
   * @param graphic [Object] 必要,Graphic,需要高亮的图形
   * @param symbol [Object] 必要，高亮的样式
   */
  highlightSelect(graphic, symbol) {
    if (this.mapview.graphics.length > 0) this.mapview.graphics.removeAll();
    const currentSelected = graphic.clone();
    currentSelected.symbol = symbol;
    this.mapview.graphics.add(currentSelected);
  }

  /**
   *  转换坐标
   * @param coords [Array] 必要,需要转换的坐标
   * @param inputCoordSys [String] 必要，当前坐标系，可选值：'WGS84'/'GCJ02'/'BD09'
   * @param targetCoordSys [String] 必要，目标坐标系，可选值：'WGS84'/'GCJ02'/'BD09'
   * @return { *[] } Array
   */
  transCoords(coords, inputCoordSys, targetCoordSys) {
    return trans[`${inputCoordSys}to${targetCoordSys}`](coords[0], coords[1]);
  }

  /**
   *  创建聚合图层所需图标
   * @param type [String] 必要，类型，可选值：'simple-marker'/'simple-fill'
   * @param breakObj [Array] 必要，断点选项数组
   * @return renderer [Object] ClassBreaksRenderer
   */
  creatFclRender(type, breakObj) {
    const breakSymbol = [];
    const defaultSet = [
      [[255, 0, 0, 1], [], 6],
      [[255, 204, 102, 0.8], [221, 159, 34, 0.8], 22],
      [[102, 204, 255, 0.8], [82, 163, 204, 0.8], 24],
      [[51, 204, 51, 0.8], [41, 163, 41, 0.8], 28],
      [[250, 65, 74, 0.8], [200, 52, 59, 0.8], 32]
    ];
    breakObj.map((obj, index) => {
      breakSymbol.push({
        type: type,
        style: type === "simple-marker" ? "circle" : "solid",
        color: obj.fillColor || defaultSet[index][0],
        size: obj.iconSize || defaultSet[index][2],
        outline:
          index === 0
            ? null
            : { color: obj.outlineColor || defaultSet[index][1] }
      });
    });

    const renderer = new this.$GisApi.ClassBreaksRenderer({
      defaultSymbol: breakObj[0].icon || breakSymbol[0]
    });
    renderer.field = "clusterCount";

    renderer.addClassBreakInfo(
      breakObj[0].number || breakObj[0],
      breakObj[1].number || breakObj[1],
      type === "simple-marker" && breakObj[1].icon
        ? breakObj[1].icon
        : breakSymbol[1]
    );
    renderer.addClassBreakInfo(
      (breakObj[1].number || breakObj[1]) + 1,
      breakObj[2].number || breakObj[2],
      type === "simple-marker" && breakObj[2].icon
        ? breakObj[2].icon
        : breakSymbol[2]
    );
    renderer.addClassBreakInfo(
      (breakObj[2].number || breakObj[2]) + 1,
      breakObj[3].number || breakObj[3],
      type === "simple-marker" && breakObj[3].icon
        ? breakObj[3].icon
        : breakSymbol[3]
    );
    renderer.addClassBreakInfo(
      (breakObj[3].number || breakObj[3]) + 1,
      breakObj[4].number || breakObj[4],
      type === "simple-marker" && breakObj[4].icon
        ? breakObj[4].icon
        : breakSymbol[4]
    );

    return renderer;
  }

  /**
   *  创建聚合图层
   * @param breakNumOpts [Array] 必要，断点选项数组
            eg1:[0,20,150,1000,Infinity]
            eg2:[
              {
                number:0,
                fillColor:[255, 0, 0, 1],
                iconSize:6,
                outlineColor:[]
              },
              {
                number:20,
                fillColor:[255, 204, 102, 0.8],
                iconSize:22,
                outlineColor:[221, 159, 34, 0.8]
              },
              ...
            ]
            eg3:[
              {
                number:0,
                icon:PictureMarkerSymbol
              },
              {
                number:20,
                icon:PictureMarkerSymbol
              },
              ...
            ]
   * @param opts [Object] 必要，聚合图层的参数
            eg:{
              id: "flare-cluster-layer",
              clusterRenderer: renderer,
              areaRenderer: areaRenderer,
              flareRenderer: flareRenderer,
              singlePopupTemplate: popupTemplate,
              spatialReference: new SpatialReference({
                  "wkid": 4326
              }),
              subTypeFlareProperty: "facilityType",
              singleFlareTooltipProperty: "name",
              displaySubTypeFlares: true,
              maxSingleFlareCount: 8,
              clusterRatio: 75,
              clusterAreaDisplay: 'activated',
              data: [
                {
                  "toiletId": 1000000,
                  "name": "Ocean block",
                  "postcode": "6054",
                  "facilityType": "Underwater",
                  "isOpen": "AllHours",
                  "x": -158.036,
                  "y": -9.0058
                },
                {
                  "toiletId": 1,
                  "name": "Sandy Beach Reserve",
                  "postcode": "6054",
                  "facilityType": "Park or reserve",
                  "isOpen": "AllHours",
                  "x": 115.9502062,
                  "y": -31.921836
                }
              ]
            }
   * @return FlareClusterLayer [Object] 聚合图层
   */
  createFclLayer(breakNumOpts, opts) {
    const renderer = this.creatFclRender("simple-marker", breakNumOpts);
    const areaRenderer = this.creatFclRender("simple-fill", breakNumOpts);
    const flareRenderer = this.creatFclRender("simple-marker", breakNumOpts);
    const options = {
      clusterRenderer: renderer,
      areaRenderer: areaRenderer,
      flareRenderer: flareRenderer
    };
    Object.assign(options, opts);
    return new this.$GisApi.FclLayer.FlareClusterLayer(options);
  }

  /**
   * 添加 GeoJSON 数据
   * @param {GeoJson} geoJson
   * @param {object} opts
   */
  addGeoJson(geoJson, opts) {
    const graphics = [];
    geoJson.features.map((feature, i) => {
      if (i === geoJson.features.length - 1) {
        const fullExtent = this.mapview.map.allLayers.toArray()[0].fullExtent;
        const fullExtentGeo = this.$GisApi.webMercatorUtils.webMercatorToGeographic(
          fullExtent
        );
        const fullExtentCoords = [
          [
            [fullExtentGeo.xmin, fullExtentGeo.ymin],
            [fullExtentGeo.xmin, fullExtentGeo.ymax],
            [fullExtentGeo.xmax, fullExtentGeo.ymax],
            [fullExtentGeo.xmax, fullExtentGeo.ymin]
          ]
        ];
        fullExtentCoords.push(feature.geometry.coordinates[0]);
        graphics.push({
          geometry: {
            type: "polygon",
            rings: fullExtentCoords
          },
          attributes: feature.properties,
          symbol: {
            type: "simple-fill",
            color:
              opts.stick && opts.stick.backgroundColor
                ? opts.stick.backgroundColor
                : "rgba(0,0,0,0)",
            outline: {
              color: opts.outlineColor,
              width: 1
            }
          }
        });
      } else {
        const polygonGeo = new this.$GisApi.Polygon({
          rings: feature.geometry.coordinates || null
        });
        graphics.push({
          geometry: polygonGeo,
          attributes: feature.properties,
          symbol: {
            type: "simple-fill",
            color:
              opts.stick && opts.stick.highlightColor
                ? opts.stick.highlightColor
                : "rgba(0,0,0,0)",
            outline: {
              color: opts.outlineColor,
              style: "dash-dot",
              width: 1
            }
          }
        });
        // graphics.push({
        //   geometry: polygonGeo.centroid,
        //   symbol: {
        //     type: 'text',
        //     color: '#999',
        //     haloColor: 'black',
        //     haloSize: '1px',
        //     text: feature.properties.name,
        //     xoffset: 3,
        //     yoffset: 3,
        //     font: {
        //       size: 10,
        //       family: 'sans-serif'
        //     }
        //   }
        // })
      }
    });
    const lyr = new this.$GisApi.GraphicsLayer({
      id: opts.layerId,
      graphics: graphics
    });
    const baseLayers = this.mapview.map.basemap.baseLayers;
    baseLayers.splice(baseLayers.length - 1, 0, lyr);
  }

  /**
   * 操作 Graphic ，进行增、删、改
   * @param {feaLayer} feaLayer
   * @param {string} editType
   * @param {Graphic} newGra
   */
  operateFeature(feaLayer, editType, newGra) {
    const featureAttr = newGra.attributes;
    let graphic = null;
    switch (editType) {
      case "add":
        graphic = new this.$GisApi.Graphic({
          geometry: newGra.geometry,
          attributes: featureAttr
        });
        feaLayer.applyEdits({
          addFeatures: [graphic]
        });
        break;
      case "delete":
        feaLayer.applyEdits({
          deleteFeatures: [featureAttr]
        });
        break;
      case "update":
        graphic = new this.$GisApi.Graphic({
          geometry: newGra.geometry,
          attributes: featureAttr
        });
        feaLayer.applyEdits({
          updateFeatures: [graphic]
        });
        break;
    }
  }

  /**
   * 计算两个经纬度距离(google map)
   * @param {number} startLon 开始点经度
   * @param {number} startLat 开始点纬度
   * @param {number} endLon 结束点经度
   * @param {null} endLat 结束点纬度
   * @return 两点距离 m
   */
  degreeToDistance(startLon, startLat, endLon, endLat) {
    if (startLon || startLon || endLon || endLat) {
      return null;
    }
    const radStartLat = this.rad(startLat);
    const radEndLat = this.rad(endLat);
    const a = radStartLat - radEndLat;
    const b = this.rad(startLon) - this.rad(endLon);
    let s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radStartLat) *
              Math.cos(radEndLat) *
              Math.pow(Math.sin(b / 2), 2)
        )
      );
    s = s * EARTH_RADIUS;
    return s;
  }

  /**
   * 度转换为弧度
   * @param {*} degree
   */
  rad(degree) {
    return (degree * Math.PI) / 180;
  }
}
export default SomeMethods;
