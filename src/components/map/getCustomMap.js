export function GetLayers($gisAPI, mapTheme) {
  // 天地图矢量图
  const LAYER_TDTVEC = new $gisAPI.CustomBaseMap({
    mapType: 'tdt',
    tk: '07d4e04324b413cb0582fa99fe833cd3',
    sty: 'vec_w'
  });
  if (mapTheme) {
    LAYER_TDTVEC.on('layerview-create', event => {
      const layerContainer = event.layerView.container;
      const timer = setInterval(() => {
        if (layerContainer.element) {
          layerContainer.element.style.filter = 'grayscale(100%) invert(100%)';
          clearInterval(timer);
        }
      }, 100);
    });
  }

  // 天地图矢量注记
  const LAYER_TDTVEC_ANNO = new $gisAPI.CustomBaseMap({
    mapType: 'tdt',
    tk: '07d4e04324b413cb0582fa99fe833cd3',
    sty: 'cva_w',
    opacity: 0.7
  });
  if (mapTheme) {
    LAYER_TDTVEC_ANNO.on('layerview-create', event => {
      const layerContainer = event.layerView.container;
      const timer = setInterval(() => {
        if (layerContainer.element) {
          layerContainer.element.style.filter = 'hue-rotate(192deg)';
          clearInterval(timer);
        }
      }, 100);
    });
  }

  // 天地图卫星图
  const LAYER_TDTSAT = new $gisAPI.CustomBaseMap({
    mapType: 'tdt',
    tk: '07d4e04324b413cb0582fa99fe833cd3',
    sty: 'img_w'
  });

  // 天地图卫星图注记
  const LAYER_TDTSAT_ANNO = new $gisAPI.CustomBaseMap({
    mapType: 'tdt',
    tk: '07d4e04324b413cb0582fa99fe833cd3',
    sty: 'cia_w'
  });

  // 百度矢量地图
  const LAYER_BD = new $gisAPI.BDLayer();

  // 高德矢量地图
  const LAYER_GD = new $gisAPI.CustomBaseMap({
    mapType: 'gd',
    sty: 7
  });

  // 高德卫星图
  const LAYER_GDSAT = new $gisAPI.CustomBaseMap({
    mapType: 'gd',
    sty: 6
  });
  // 高德标注图层
  const LAYER_GD_ANNO = new $gisAPI.CustomBaseMap({
    mapType: 'gd',
    sty: 8
  });

  // 谷歌地图
  const LAYER_GOOGLE = new $gisAPI.CustomBaseMap({
    mapType: 'google',
    sty: 'm'
  });

  // 谷歌卫星图
  const LAYER_GOOGLESAT = new $gisAPI.CustomBaseMap({
    mapType: 'google',
    sty: 'y'
  });

  return {
    LAYER_TDTVEC: LAYER_TDTVEC,
    LAYER_TDTVEC_ANNO: LAYER_TDTVEC_ANNO,
    LAYER_TDTSAT: LAYER_TDTSAT,
    LAYER_TDTSAT_ANNO: LAYER_TDTSAT_ANNO,
    LAYER_BD: LAYER_BD,
    LAYER_GD: LAYER_GD,
    LAYER_GDSAT: LAYER_GDSAT,
    LAYER_GD_ANNO: LAYER_GD_ANNO,
    LAYER_GOOGLE: LAYER_GOOGLE,
    LAYER_GOOGLESAT: LAYER_GOOGLESAT
  };
}
