export const ServiceUrl = {
  baseMap:
    "http://192.168.1.211:6080/arcgis/rest/services/CD_SLServer/CD_BaseMap/MapServer",
  // 这里可以定义自己服务器上的底图的地址，也可以使用ArcGis提供的底图，详见Basemap类
  apiUrl: "https://localhost:8083/init.js",
  cssUrl: "https://localhost:8083//esri/css/main.css",
  // apiUrl: 'http://hujiahua.site:8002/4.6/dojo/dojo.js', // 使用官网提供的api，但是更建议使用离线部署的地址
  tileLayer: [
    {
      id: "TL0",
      url:
        "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer"
    }
  ],
  featureLayer: [
    {
      url:
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3"
    }
    // {
    //   url: 'http://192.168.1.211:6080/arcgis/rest/services/test/test/MapServer/0'
    // },
    // {
    //   url: 'http://192.168.1.211:6080/arcgis/rest/services/CD_SLServer/CD_FeatureInfo/MapServer/8'
    // }
  ]
};
