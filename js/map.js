var map = new ol.Map({ // a map object is created
    target: 'map', // the id of the div in html to contain the map
    layers: [ // list of layers available in the map
        new ol.layer.Tile({ // first and only layer is the OpenStreetMap tiled layer
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({ // view allows to specify center, resolution, rotation of the map
        center: ol.proj.fromLonLat([33.411254, 35.144581]), // center of the map
        zoom: 15 // zoom level (0 = zoomed out)
    })
});
