define(['dojo/_base/declare', 'dojo/_base/lang', 'esri/layers/BaseTileLayer', 'esri/request', 'esri/Color'],
  function (declare, lang, BaseTileLayer, esriRequest, Color) {
    return BaseTileLayer.createSubclass({
      properties: {
        urlTemplate: null,
        mapType: null,
        tk: null,
        sty: null,
        tint: {
          value: null,
          type: Color
        }
      },
      getTileUrl: function (level, row, col) {
        if (this.mapType === 'tdt') {
          return `http://t0.tianditu.gov.cn/DataServer?T=${this.sty}&x=${col}&y=${row}&l=${level}&tk=${this.tk}`;
        } else if (this.mapType === 'google') {
          return `http://mt2.google.cn/vt/lyrs=${this.sty}&scale=2&hl=zh-CN&gl=cn&x=${col}&y=${row}&z=${level}`;
        } else if (this.mapType === 'gd') {
          return `http://wprd0${(col % 4 + 1)}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=${this.sty}&x=${col}&y=${row}&z=${level}&scl=1`
        }
      },
      fetchTile: function (level, row, col) {
        var url = this.getTileUrl(level, row, col);
        return esriRequest(url, {
          responseType: 'image'
        }).then(function (response) {
            var image = response.data;
            var width = this.tileInfo.size[0];
            var height = this.tileInfo.size[0];

            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;

            context.drawImage(image, 0, 0, width, height);
            if (this.tint) {
              context.fillStyle = this.tint.toCss();
              context.fillRect(0, 0, width, height);
              context.globalCompositeOperation = 'difference';
            }
            return canvas;
          }.bind(this));
      }
    });
  }
);
