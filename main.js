window.onload = init;

function init() {
  // Attribution Control
  const attributionControl = new ol.control.Attribution({
    collapsible: true
  })

  // Map object
  const map = new ol.Map({
    view: new ol.View({
      center: [0, 0],
      zoom: 3,
    }),
    target: 'js-map',
    controls: ol.control.defaults({ attribution: false }).extend([attributionControl])
  })

  // Base Layers
  // Openstreet Map Standard
  const openstreetMapStandard = new ol.layer.Tile({
    source: new ol.source.OSM(),
    visible: true,
    title: 'OSMStandard'
  })

  // Openstreet Map Humanitarian
  const openstreetMapHumanitarian = new ol.layer.Tile({
    source: new ol.source.OSM({
      url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    }),
    visible: false,
    title: 'OSMHumanitarian'
  })

  // Bing Maps Basemap Layer
  const bingMaps = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: "Your Bingmaps API Key Here",
      imagerySet: 'CanvasGray'  // Road, CanvasDark, CanvasGray
    }),
    visible: false,
    title: 'BingMaps'
  })

  // CartoDB BaseMap Layer
  const cartoDBBaseLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'http://{1-4}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png',
      attributions: '© CARTO'
    }),
    visible: false,
    title: 'CartoDarkAll'
  })

  // Stamen basemap layer
  const StamenTerrainWithLabels = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'terrain-labels',
      attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: false,
    title: 'StamenTerrainWithLabels'
  })

  const StamenTerrain = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
      attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: false,
    title: 'StamenTerrain'
  })

  //Base Vector Layers
//Vector Tile Layer OpenstreetMap
const openstreetMapVectorTile =new ol.layer.VectorTile({
  source:new ol.source.VectorTile({
    url:'https://api.maptiler.com/tiles/terrain-quantized-mesh/{z}/{x}/{y}.quantized-mesh-1.0?key=mqTHvZgpLZh6rC8bMa6r',
    //format:,
    attributions: '<a href=https://bobcat.com/>© BobCat<a/>'
  }),
  visible:true
})
map.addLayer(openstreetMapVectorTile);



  // Layer Group
  const baseLayerGroup = new ol.layer.Group({
    layers: [
      openstreetMapStandard, openstreetMapHumanitarian, bingMaps, cartoDBBaseLayer,
      StamenTerrainWithLabels, StamenTerrain,
    ]
  })
  map.addLayer(baseLayerGroup);

  // Layer Switcher Logic for BaseLayers
  const baseLayerElements = document.querySelectorAll('.sidebar > input[type=radio]')
  for (let baseLayerElement of baseLayerElements) {
    baseLayerElement.addEventListener('change', function () {
      let baseLayerElementValue = this.value;
      baseLayerGroup.getLayers().forEach(function (element, index, array) {
        let baseLayerName = element.get('title');
        element.setVisible(baseLayerName === baseLayerElementValue)
      })
    })
  }

  //Multilayers Part 2.
  // TileDebug
  const tileDebugLayer = new ol.layer.Tile({
    source: new ol.source.TileDebug(),
    visible: false,
    title: 'TileDebugLayer'
  })


  // tile ArcGIS REST API Layer
  const tileArcGISLayer = new ol.layer.Tile({
    source: new ol.source.TileArcGISRest({
      url: "http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Louisville/LOJIC_LandRecords_Louisville/MapServer",
      attributions: 'Copyright© 2008, MSD, PVA, Louisville Water Company, Louisville Metro Government'
    }),
    visible: false,
    title: 'TileArcGISLayer'
  })


  // NOAA WMS Layer
  const NOAAWMSLayer = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_dailymaxairtemp_offsets/MapServer/WMSServer?',
      params: {
        LAYERS: 5,
        FORMAT: 'image/png',
        TRANSPARENT: true
      },
      attributions: '<a href=https://nowcoast.noaa.gov/>© NOAA<a/>'
    }),
    visible: false,
    title: 'NOAAWMSLayer'
  })

  //Raster Tile Layer Group.
  const rasterTileLayerGroup = new ol.layer.Group({
    layers: [
      tileArcGISLayer, NOAAWMSLayer, tileDebugLayer
    ]
  })
  map.addLayer(rasterTileLayerGroup);

  // LAYER SWITCHER LOGIC FOR RASTER TILE LAYER.
  const tileRasterLayerElements = document.querySelectorAll('.sidebar > input[type=checkbox]');
  for (let tileRasterLayerElement of tileRasterLayerElements) {
    tileRasterLayerElement.addEventListener('change', function () {
      // console.log(this);
      let tileRasterLayerElementValue = this.value;
      let tileRasterLayer;

      rasterTileLayerGroup.getLayers().forEach(function (element, index, array) {
        if (tileRasterLayerElementValue === element.get('title')) {
          tileRasterLayer = element;
        }

      })
      this.checked ? tileRasterLayer.setVisible(true) : tileRasterLayer.setVisible(false)
    })
  }

  // Static Image OpenstreetMap
  const openstreetMapFragmentStatic = new ol.layer.Image({
    source: new ol.source.ImageStatic({
      url: './data/static_image/boliviaxyz.png',
      //imageExtent:[-9994065.011258509,-4980025.266835803,-5004255.804802204, -2534040.361710163,-14675.90943075344],
      imageExtent:[-10018524.860309763,-4955565.417784546,-5053175.502904716,34243.78867175989],
      attributions: '<a href=http://www.google.com>OpenStack</a>'
    }),
    title: 'openstreetMapFragmentStatic'
  })
  map.addLayer(openstreetMapFragmentStatic);

  map.on('click', function (e) {
    console.log(e.coordinate);
  })

}


