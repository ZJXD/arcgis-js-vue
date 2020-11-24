# 说明

> ArcGISMap Demo

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## 功能介绍

1、基于 ArcGIS API for JS 的一个 Vue 示例  
2、ArcGIS API JS 文件的引用本地的，需要本地发布才可以调用，想调用其他的可以调整  
3、现阶段加载了国内一些主流的地图，和 ArcGIS 官方给的一些图层地图  
4、关于百度地图说明：由于百度地图的切片不是严格按照金字塔模型的，其中会出现正常切片的一半，所以这种方法是有些问题  
5、实现 2D 和 3D 切换，都是基于 ArcGIS 的图层，所以像谷歌地图在 3D 下和谷歌地图是有差别  
6、在 2D 视图下，添加了基本操作和基本编辑

## 自定义图层
通过自定图层，添加了对天地图、高德、谷歌地图的切片地图的支持   
1、BaseTileLayer 生成自定义图层   
2、根据传入的参数，获取对应地图
