// add button
$(".map-toolbar").append("<a class='waves-effect waves-light btn-small' id='showBlueDots'>Show me blue dots</a>");

$( "#showBlueDots" ).click(function() {
    setStyle()
});

// set Style
function setStyle() {
    $(".map-toolbar").append("<a class='waves-effect waves-light btn-small' id='showFeatures'>What's here ?</a>");

    $( "#showFeatures" ).click(function() {
        showFeatures()
    });
    window.mapgl.easeTo({
        center: [0,0],
        zoom: 0})
    window.mapgl.setStyle({
        "version": 8,
        "name": "Blue dots",
        "metadata": {
            "mapbox:autocomposite": true,
            "mapbox:type": "template",
            "mapbox:sdk-support": {
                "js": "0.50.0",
                "android": "6.7.0",
                "ios": "4.6.0"
            },
            "mapbox:groups": {
                "45bf0c7e89724249ad82d32c248fba77": {
                    "name": "Group"
                }
            }
        },
        "center": [
            -105.69,
            38.16
        ],
        "zoom": 4.25,
        "bearing": 0,
        "pitch": 0,
        "light": {
            "intensity": 0.08,
            "color": "hsl(41, 0%, 100%)",
            "anchor": "map",
            "position": [
                10,
                100,
                300
            ]
        },
        "sources": {
            "mapbox://mapbox.satellite": {
                "url": "mapbox://mapbox.satellite",
                "type": "raster",
                "tileSize": 256
            },
            "mapbox://mapbox.satellite-watermask": {
                "url": "mapbox://mapbox.satellite-watermask",
                "type": "raster",
                "tileSize": 256
            },
            "composite": {
                "url": "mapbox://mapbox.mapbox-streets-v8,ealessandrini.60h01sbw",
                "type": "vector"
            }
        },
        "sprite": "mapbox://sprites/ev2/ckl107xyn00ac17nvqikolcvt/b8l8yeuy4fg22z515axrafrk3",
        "glyphs": "mapbox://fonts/ev2/{fontstack}/{range}.pbf",
        "layers": [
            {
                "id": "mapbox-satellite (1)",
                "type": "raster",
                "source": "mapbox://mapbox.satellite",
                "layout": {},
                "paint": {
                    "raster-saturation": [
                        "step",
                        [
                            "zoom"
                        ],
                        -0.8,
                        8,
                        -0.6,
                        15,
                        -0.73,
                        22,
                        -0.73
                    ],
                    "raster-contrast": 0.05,
                    "raster-brightness-max": [
                        "step",
                        [
                            "zoom"
                        ],
                        0.69,
                        12.17,
                        1,
                        22,
                        1
                    ]
                }
            },
            {
                "id": "mapbox-satellite-watermask",
                "type": "raster",
                "paint": {
                    "raster-saturation": -0.47
                },
                "source": "mapbox://mapbox.satellite-watermask"
            },
            {
                "id": "place-label",
                "type": "symbol",
                "source": "composite",
                "source-layer": "place_label",
                "filter": [
                    "match",
                    [
                        "get",
                        "filterrank"
                    ],
                    [
                        1
                    ],
                    true,
                    false
                ],
                "layout": {
                    "text-field": [
                        "to-string",
                        [
                            "get",
                            "name"
                        ]
                    ],
                    "text-transform": "uppercase",
                    "text-letter-spacing": 0.3,
                    "text-font": [
                        "Open Sans Bold",
                        "Arial Unicode MS Regular"
                    ],
                    "text-size": 10
                },
                "paint": {
                    "text-color": "hsl(188, 31%, 95%)",
                    "text-halo-color": "#000000",
                    "text-halo-width": 1
                }
            },
            {
                "id": "road",
                "type": "symbol",
                "paint": {
                    "text-color": "hsl(0, 0%, 100%)",
                    "text-halo-color": "hsla(0, 0%, 0%, 0.91)",
                    "text-halo-width": 0.5,
                    "text-opacity": [
                        "step",
                        [
                            "zoom"
                        ],
                        0,
                        15,
                        1
                    ]
                },
                "layout": {
                    "text-field": [
                        "to-string",
                        [
                            "get",
                            "name"
                        ]
                    ],
                    "symbol-placement": "line",
                    "text-size": 13,
                    "text-font": [
                        "Open Sans SemiBold",
                        "Arial Unicode MS Regular"
                    ]
                },
                "source": "composite",
                "source-layer": "road"
            },
            {
                "id": "mrds 3",
                "type": "circle",
                "paint": {
                    "circle-color": "hsl(215, 84%, 46%)",
                    "circle-radius": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        0,
                        10,
                        13,
                        20,
                        15,
                        30
                    ],
                    "circle-opacity": [
                        "step",
                        [
                            "zoom"
                        ],
                        0.04,
                        7,
                        0.04,
                        10,
                        0.04,
                        13,
                        0.06,
                        16,
                        0.2
                    ],
                    "circle-blur": 2
                },
                "layout": {},
                "source": "composite",
                "source-layer": "mrds"
            },
            {
                "id": "mrds 2",
                "type": "circle",
                "paint": {
                    "circle-color": "hsl(191, 84%, 33%)",
                    "circle-radius": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        0,
                        10,
                        12.2,
                        20,
                        13.5,
                        22,
                        15,
                        25,
                        22,
                        30
                    ],
                    "circle-blur": 3,
                    "circle-opacity": [
                        "step",
                        [
                            "zoom"
                        ],
                        0.05,
                        6,
                        0.05,
                        12,
                        0.12,
                        13,
                        0.26,
                        15,
                        0.3,
                        18,
                        0.6
                    ]
                },
                "layout": {},
                "source": "composite",
                "source-layer": "mrds"
            },
            {
                "id": "mrds 1",
                "type": "circle",
                "paint": {
                    "circle-color": "hsl(191, 85%, 65%)",
                    "circle-radius": [
                        "step",
                        [
                            "zoom"
                        ],
                        5,
                        13,
                        10,
                        22,
                        15
                    ],
                    "circle-blur": 3,
                    "circle-opacity": [
                        "step",
                        [
                            "zoom"
                        ],
                        0.2,
                        12,
                        0.43,
                        15,
                        0.82
                    ]
                },
                "layout": {
                    "visibility": "none"
                },
                "source": "composite",
                "source-layer": "mrds"
            },
            {
                "id": "mrds",
                "type": "circle",
                "paint": {
                    "circle-radius": [
                        "interpolate",
                        [
                            "linear"
                        ],
                        [
                            "zoom"
                        ],
                        0,
                        1,
                        22,
                        5
                    ],
                    "circle-color": "hsl(0, 0%, 100%)"
                },
                "layout": {},
                "source": "composite",
                "source-layer": "mrds"
            }
        ],
        "visibility": "private",
        "draft": false
    })
}


function showFeatures() {
    const features = window.mapgl.queryRenderedFeatures({ layers: ['mrds'] })

    const displayProperties = [
        'site_name',
        'commod1',
        'commod2',
        'commod3',
        'url'
    ]

    const displayFeatures = features.map(feat => {
        const displayFeat = {}
        displayProperties.forEach(function (prop) {
            displayFeat[prop] = feat.properties[prop]
        })
        displayFeat['lnglat'] = feat.geometry.coordinates[1].toString().substring(0, 8) + ', ' + feat.geometry.coordinates[0].toString().substring(0, 8)
        return displayFeat
    })

    console.table(displayFeatures)
    M.toast({html: 'Data is printed into the console', classes: 'primary darken-1'})
}
