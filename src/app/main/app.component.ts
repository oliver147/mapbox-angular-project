import {Component, contentChild, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import * as mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import {environment} from "../environment/environment";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import * as turf from '@turf/turf'
import {AllGeoJSON, BBox, LineString, Point} from "@turf/turf";
import rectangleGrid from "@turf/rectangle-grid";
import {Feature, Polygon, Units} from "@turf/helpers";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";
import {
  SnapPolygonMode,
  SnapPointMode,
  SnapLineMode,
  SnapModeDrawStyles,
} from "mapbox-gl-draw-snap-mode";

import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatButton, MatIconButton, MatIcon, MatMenu, MatMenuTrigger, MatMenuItem, MatSlideToggle, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  kwsHQCoords = turf.point([9.885015, 51.814994]);
  map: mapboxgl.Map;
  layers = [
    {name: 'Streets', style: 'mapbox://styles/mapbox/streets-v12'},
    {name: 'Satellite', style: 'mapbox://styles/mapbox/satellite-streets-v12'},
    // {name: 'Light', style: 'mapbox://styles/mapbox/light-v11'},
    // {name: 'Dark', style: 'mapbox://styles/mapbox/dark-v11'},
  ];
  options: {
    units?: Units;
    zTranslation?: number;
    mutate?: boolean;
  } = {units: 'meters'};

  config = {
    plotLength: 10, //7.5,
    workingWidth: 6, //2.7,
    plotsPerWorkingWidth: 1, //3,
    xGap: 2,
    yGap: 4,
    xCount: 10,
    yCount: 10
  }
  plots: any[] = [];
  plotLabels: any[] = [];
  alleyLines: any[] = [];
  sowingLines: any[] = [];
  origin =  turf.clone(this.kwsHQCoords);
  angle = 45;
  hoveredPolygonId = null;
  is3d = false;
  plotsMinZoom = 16;
  draw: any;


  public ngOnInit(): void {
    this.initMap();
    this.setUpDrawing();
  }

  public onLayerSelected(style: string) {
    this.map.setStyle(style);
  }

  public addGeoJson() {


    // GEOJSON

    const pointGeoJson: AllGeoJSON = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: this.kwsHQCoords.geometry.coordinates
      },
      properties: {
        name: "KWS HQ"
      }
    }


    // ADD LAYERS TO MAP

    this.map.addLayer({
      id: 'point',
      type: 'circle',
      source: 'point',
      layout: {},
      paint: {
        'circle-color': '#ff6c00',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#fff'
      }
    });

    this.map.addLayer({
      id: 'point_label',
      type: 'symbol',
      source: 'point',
      layout: {
        'text-field': ['get', 'name'],
        'text-offset': [0, 0.1],
        'text-anchor': 'top'
      },
    });

    this.map.addLayer({
      id: 'polygon',
      type: 'fill',
      source: 'polygon',
      layout: {},
      paint: {
        'fill-color': '#ff6c00',
        'fill-opacity': 0.5,
      }
    });

    this.map.addLayer({
      id: 'polygon_outline',
      type: 'line',
      source: 'polygon',
      layout: {},
      paint: {
        'line-color': '#ff6c00',
        'line-width': 2,
      }
    });

    this.map.addLayer({
      id: 'polygon_label',
      type: 'symbol',
      source: 'polygon_label',
      layout: {
        'text-field': ['get', 'name'],
        'text-offset': [0, 0],
        'text-anchor': 'center'
      },
    });
  }

  public generatePlotLayout() {

    this.generatePlots();
    this.generateAlleyLines();
    this.generateSowingLines();

  }

  private resetMap() {
    try {

    this.map.removeLayer('point')
    this.map.removeLayer('point_label')
    this.map.removeLayer('polygon')
    this.map.removeLayer('polygon_outline')
    this.map.removeLayer('polygon_label')
    this.map.removeLayer('plotsFill')
    this.map.removeLayer('plotsOutline')
    this.map.removeLayer('plotsExtrusion')
    this.map.removeLayer('plotsLabel')
    this.map.removeLayer('alleyLines')
    this.map.removeLayer('sowingLines')
    this.map.removeLayer('abLine')
    this.map.removeLayer('highlighted')


    this.map.removeSource('sowingLines')
    this.map.removeSource('plots')
    this.map.removeSource('alleyLines')
    this.map.removeSource('abLine')

    this.plots = [];
    this.sowingLines = [];
    this.alleyLines = [];
    this.plotLabels = [];

  } catch (error) {

  }
  }

  private setUpDrawing() {
    const polygonGeoJson: Feature<Polygon> = {
      type: "Feature",
      id: "15690",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [
              9.862017000000023,
              51.79892199999996
            ],
            [
              9.862087999999966,
              51.79893500000002
            ],
            [
              9.862159999999994,
              51.79894899999998
            ],
            [
              9.862232000000017,
              51.798962999999986
            ],
            [
              9.862304000000044,
              51.798977000000036
            ],
            [
              9.862374999999988,
              51.79899100000001
            ],
            [
              9.862447000000012,
              51.799004999999966
            ],
            [
              9.86251900000004,
              51.79901899999998
            ],
            [
              9.862589999999983,
              51.79903300000002
            ],
            [
              9.863737999999975,
              51.799256000000014
            ],
            [
              9.863809000000009,
              51.799270000000014
            ],
            [
              9.863881000000035,
              51.79928400000001
            ],
            [
              9.863952999999972,
              51.79929799999999
            ],
            [
              9.864024000000004,
              51.79931200000002
            ],
            [
              9.86409600000003,
              51.799326000000036
            ],
            [
              9.864167999999966,
              51.79933999999998
            ],
            [
              9.864239,
              51.799354000000015
            ],
            [
              9.864311000000024,
              51.799367000000004
            ],
            [
              9.864382999999961,
              51.799381
            ],
            [
              9.865243000000032,
              51.799549000000006
            ],
            [
              9.865314999999967,
              51.79956300000003
            ],
            [
              9.865386999999993,
              51.79957699999999
            ],
            [
              9.865458000000027,
              51.79958999999997
            ],
            [
              9.865529999999964,
              51.79960399999998
            ],
            [
              9.865601999999987,
              51.79961799999999
            ],
            [
              9.86567300000002,
              51.79963199999999
            ],
            [
              9.865744999999958,
              51.799646000000024
            ],
            [
              9.865816999999984,
              51.799660000000046
            ],
            [
              9.866391000000027,
              51.79977199999998
            ],
            [
              9.866461999999968,
              51.799786
            ],
            [
              9.866533999999994,
              51.79979899999998
            ],
            [
              9.866761999999985,
              51.79984600000002
            ],
            [
              9.866870000000025,
              51.79986600000002
            ],
            [
              9.86697699999998,
              51.799887
            ],
            [
              9.867084000000027,
              51.79990699999998
            ],
            [
              9.867191999999976,
              51.79992799999998
            ],
            [
              9.867299000000022,
              51.799948
            ],
            [
              9.867366999999986,
              51.79997100000001
            ],
            [
              9.868186999999983,
              51.800511
            ],
            [
              9.868222000000001,
              51.80056299999997
            ],
            [
              9.868235999999994,
              51.80058999999997
            ],
            [
              9.868257000000025,
              51.80064599999997
            ],
            [
              9.868272999999999,
              51.800705000000015
            ],
            [
              9.86827699999997,
              51.80074000000001
            ],
            [
              9.868275999999979,
              51.800769
            ],
            [
              9.868267000000042,
              51.80081800000003
            ],
            [
              9.868246000000012,
              51.80087399999998
            ],
            [
              9.868225999999975,
              51.80093100000002
            ],
            [
              9.867979000000028,
              51.80161700000001
            ],
            [
              9.867957999999998,
              51.80167599999998
            ],
            [
              9.867881000000008,
              51.80185999999998
            ],
            [
              9.867821999999979,
              51.801875
            ],
            [
              9.86775899999998,
              51.801869999999994
            ],
            [
              9.867670999999977,
              51.80185099999998
            ],
            [
              9.867563000000029,
              51.80183099999997
            ],
            [
              9.867454999999989,
              51.80181200000003
            ],
            [
              9.866011000000038,
              51.801533999999975
            ],
            [
              9.865929999999986,
              51.801518
            ],
            [
              9.865849000000026,
              51.801503000000025
            ],
            [
              9.865767999999974,
              51.801486999999995
            ],
            [
              9.864937999999958,
              51.80132600000003
            ],
            [
              9.86484699999998,
              51.80130799999996
            ],
            [
              9.864755000000006,
              51.80128999999999
            ],
            [
              9.864664000000024,
              51.801272
            ],
            [
              9.864571999999962,
              51.80125400000003
            ],
            [
              9.864480999999982,
              51.80123599999999
            ],
            [
              9.86438900000001,
              51.80121799999999
            ],
            [
              9.864298000000028,
              51.80119999999997
            ],
            [
              9.86420800000004,
              51.80118299999998
            ],
            [
              9.862869999999964,
              51.80092600000003
            ],
            [
              9.862781999999962,
              51.800909
            ],
            [
              9.86269399999996,
              51.800892
            ],
            [
              9.862592999999963,
              51.800871999999984
            ],
            [
              9.862493000000045,
              51.80085300000002
            ],
            [
              9.862393000000038,
              51.800832999999976
            ],
            [
              9.862293000000031,
              51.800813000000005
            ],
            [
              9.861352,
              51.80062799999996
            ],
            [
              9.861265999999985,
              51.80060999999998
            ],
            [
              9.861179999999969,
              51.80059300000001
            ],
            [
              9.861134000000026,
              51.80055299999998
            ],
            [
              9.861137999999999,
              51.80050299999999
            ],
            [
              9.861167999999964,
              51.80043800000001
            ],
            [
              9.861197000000027,
              51.800373000000015
            ],
            [
              9.861226999999994,
              51.80030799999999
            ],
            [
              9.86150899999996,
              51.799744999999994
            ],
            [
              9.86153299999997,
              51.799698999999976
            ],
            [
              9.861556999999976,
              51.79965200000003
            ],
            [
              9.861580999999987,
              51.79960600000002
            ],
            [
              9.861604999999996,
              51.79955900000001
            ],
            [
              9.861629000000002,
              51.799513
            ],
            [
              9.861653000000011,
              51.79946599999999
            ],
            [
              9.86167700000002,
              51.799419999999984
            ],
            [
              9.86170100000003,
              51.79937299999998
            ],
            [
              9.861725000000039,
              51.799326000000036
            ],
            [
              9.861868000000007,
              51.799047
            ],
            [
              9.861892000000015,
              51.799001000000004
            ],
            [
              9.86192900000002,
              51.79893900000001
            ],
            [
              9.862017000000023,
              51.79892199999996
            ]
          ]
        ],
      },
      properties: {
        "name": "Test Field",
      },
    }

    this.draw = new MapboxDraw({
      modes: {
        ...MapboxDraw.modes,
        draw_point: SnapPointMode,
        draw_polygon: SnapPolygonMode,
        draw_line_string: SnapLineMode,
      },
      // Styling guides
      styles: SnapModeDrawStyles,
      userProperties: true,
      // Config snapping features
      snap: true,
      snapOptions: {
        snapPx: 30, // defaults to 15
        snapToMidPoints: true, // defaults to false
        snapVertexPriorityDistance: 0.0025, // defaults to 1.25
      },
      guides: false,
    });
    this.map.addControl(this.draw, 'top-left');

    this.draw.set({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          id: "example-id",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [
                  9.862017000000023,
                  51.79892199999996
                ],
                [
                  9.862087999999966,
                  51.79893500000002
                ],
                [
                  9.862159999999994,
                  51.79894899999998
                ],
                [
                  9.862232000000017,
                  51.798962999999986
                ],
                [
                  9.862304000000044,
                  51.798977000000036
                ],
                [
                  9.862374999999988,
                  51.79899100000001
                ],
                [
                  9.862447000000012,
                  51.799004999999966
                ],
                [
                  9.86251900000004,
                  51.79901899999998
                ],
                [
                  9.862589999999983,
                  51.79903300000002
                ],
                [
                  9.863737999999975,
                  51.799256000000014
                ],
                [
                  9.863809000000009,
                  51.799270000000014
                ],
                [
                  9.863881000000035,
                  51.79928400000001
                ],
                [
                  9.863952999999972,
                  51.79929799999999
                ],
                [
                  9.864024000000004,
                  51.79931200000002
                ],
                [
                  9.86409600000003,
                  51.799326000000036
                ],
                [
                  9.864167999999966,
                  51.79933999999998
                ],
                [
                  9.864239,
                  51.799354000000015
                ],
                [
                  9.864311000000024,
                  51.799367000000004
                ],
                [
                  9.864382999999961,
                  51.799381
                ],
                [
                  9.865243000000032,
                  51.799549000000006
                ],
                [
                  9.865314999999967,
                  51.79956300000003
                ],
                [
                  9.865386999999993,
                  51.79957699999999
                ],
                [
                  9.865458000000027,
                  51.79958999999997
                ],
                [
                  9.865529999999964,
                  51.79960399999998
                ],
                [
                  9.865601999999987,
                  51.79961799999999
                ],
                [
                  9.86567300000002,
                  51.79963199999999
                ],
                [
                  9.865744999999958,
                  51.799646000000024
                ],
                [
                  9.865816999999984,
                  51.799660000000046
                ],
                [
                  9.866391000000027,
                  51.79977199999998
                ],
                [
                  9.866461999999968,
                  51.799786
                ],
                [
                  9.866533999999994,
                  51.79979899999998
                ],
                [
                  9.866761999999985,
                  51.79984600000002
                ],
                [
                  9.866870000000025,
                  51.79986600000002
                ],
                [
                  9.86697699999998,
                  51.799887
                ],
                [
                  9.867084000000027,
                  51.79990699999998
                ],
                [
                  9.867191999999976,
                  51.79992799999998
                ],
                [
                  9.867299000000022,
                  51.799948
                ],
                [
                  9.867366999999986,
                  51.79997100000001
                ],
                [
                  9.868186999999983,
                  51.800511
                ],
                [
                  9.868222000000001,
                  51.80056299999997
                ],
                [
                  9.868235999999994,
                  51.80058999999997
                ],
                [
                  9.868257000000025,
                  51.80064599999997
                ],
                [
                  9.868272999999999,
                  51.800705000000015
                ],
                [
                  9.86827699999997,
                  51.80074000000001
                ],
                [
                  9.868275999999979,
                  51.800769
                ],
                [
                  9.868267000000042,
                  51.80081800000003
                ],
                [
                  9.868246000000012,
                  51.80087399999998
                ],
                [
                  9.868225999999975,
                  51.80093100000002
                ],
                [
                  9.867979000000028,
                  51.80161700000001
                ],
                [
                  9.867957999999998,
                  51.80167599999998
                ],
                [
                  9.867881000000008,
                  51.80185999999998
                ],
                [
                  9.867821999999979,
                  51.801875
                ],
                [
                  9.86775899999998,
                  51.801869999999994
                ],
                [
                  9.867670999999977,
                  51.80185099999998
                ],
                [
                  9.867563000000029,
                  51.80183099999997
                ],
                [
                  9.867454999999989,
                  51.80181200000003
                ],
                [
                  9.866011000000038,
                  51.801533999999975
                ],
                [
                  9.865929999999986,
                  51.801518
                ],
                [
                  9.865849000000026,
                  51.801503000000025
                ],
                [
                  9.865767999999974,
                  51.801486999999995
                ],
                [
                  9.864937999999958,
                  51.80132600000003
                ],
                [
                  9.86484699999998,
                  51.80130799999996
                ],
                [
                  9.864755000000006,
                  51.80128999999999
                ],
                [
                  9.864664000000024,
                  51.801272
                ],
                [
                  9.864571999999962,
                  51.80125400000003
                ],
                [
                  9.864480999999982,
                  51.80123599999999
                ],
                [
                  9.86438900000001,
                  51.80121799999999
                ],
                [
                  9.864298000000028,
                  51.80119999999997
                ],
                [
                  9.86420800000004,
                  51.80118299999998
                ],
                [
                  9.862869999999964,
                  51.80092600000003
                ],
                [
                  9.862781999999962,
                  51.800909
                ],
                [
                  9.86269399999996,
                  51.800892
                ],
                [
                  9.862592999999963,
                  51.800871999999984
                ],
                [
                  9.862493000000045,
                  51.80085300000002
                ],
                [
                  9.862393000000038,
                  51.800832999999976
                ],
                [
                  9.862293000000031,
                  51.800813000000005
                ],
                [
                  9.861352,
                  51.80062799999996
                ],
                [
                  9.861265999999985,
                  51.80060999999998
                ],
                [
                  9.861179999999969,
                  51.80059300000001
                ],
                [
                  9.861134000000026,
                  51.80055299999998
                ],
                [
                  9.861137999999999,
                  51.80050299999999
                ],
                [
                  9.861167999999964,
                  51.80043800000001
                ],
                [
                  9.861197000000027,
                  51.800373000000015
                ],
                [
                  9.861226999999994,
                  51.80030799999999
                ],
                [
                  9.86150899999996,
                  51.799744999999994
                ],
                [
                  9.86153299999997,
                  51.799698999999976
                ],
                [
                  9.861556999999976,
                  51.79965200000003
                ],
                [
                  9.861580999999987,
                  51.79960600000002
                ],
                [
                  9.861604999999996,
                  51.79955900000001
                ],
                [
                  9.861629000000002,
                  51.799513
                ],
                [
                  9.861653000000011,
                  51.79946599999999
                ],
                [
                  9.86167700000002,
                  51.799419999999984
                ],
                [
                  9.86170100000003,
                  51.79937299999998
                ],
                [
                  9.861725000000039,
                  51.799326000000036
                ],
                [
                  9.861868000000007,
                  51.799047
                ],
                [
                  9.861892000000015,
                  51.799001000000004
                ],
                [
                  9.86192900000002,
                  51.79893900000001
                ],
                [
                  9.862017000000023,
                  51.79892199999996
                ]
              ]
            ],
          },
        },
      ],
    });
  }

  private createABLine(selectedPoints: { features: Feature<LineString>[]}, map: mapboxgl.Map) {
    this.resetMap();
    try {
      map.removeLayer('abLine')
      map.removeSource('abLine')
  } catch {}


    if (selectedPoints.features[0].geometry.coordinates.length < 2)
      return;

    const pointA = selectedPoints.features[0].geometry.coordinates[0];
    this.origin =  turf.point([pointA[0], pointA[1]]) ;
    const pointB = selectedPoints.features[0].geometry.coordinates[1];
    const abLine = turf.lineString([pointA, pointB]);
    this.angle = turf.angle(pointA, pointB, pointB) - 90;

  this.generatePlotLayout();

    map.addSource(
      'abLine',
      {
        type: 'geojson',
        data: abLine
      }
    );

    map.addLayer({
      id: 'abLine',
      type: 'line',
      source: 'abLine',
      layout: {},
      paint: {
        'line-color': '#023E8A',
        'line-width': 2,
      }
    });
  }

  private generatePlots() {
    const gridFeatureCollection = this.getRectGrid();

    let plotCount = 1;

    gridFeatureCollection.features.forEach(feature => {
      const plotWidth = this.config.workingWidth/this.config.plotsPerWorkingWidth
      const bBox = turf.bbox(feature);
      const minXMinY = turf.point([bBox[0], bBox[1]]);

      const maxXMinY = turf.transformTranslate(minXMinY, plotWidth, 90, this.options);
      const maxXMaxY = turf.transformTranslate(maxXMinY, this.config.plotLength, 0, this.options);

      // [minX, minY, maxX, maxY]
      const bbox: BBox = [minXMinY.geometry.coordinates[0], minXMinY.geometry.coordinates[1], maxXMaxY.geometry.coordinates[0], maxXMaxY.geometry.coordinates[1]];
      let plot = turf.bboxPolygon(bbox);
      plot.id = plotCount++;
      plot.properties = { label: plot.id };

      this.plots.push(plot);

      const center = turf.centroid(plot);
      center.properties = { label: plot.id };
      this.plotLabels.push(center);

      for (let i = 1; i < this.config.plotsPerWorkingWidth; i++) {
        let clone: Feature<Polygon> = structuredClone(plot);
        clone = turf.transformTranslate(clone, plotWidth * i, 90, this.options);
        clone.id = plotCount++;
        clone.properties = { label: clone.id };
        this.plots.push(clone);

        const center = turf.centroid(clone);
        center.properties = { label: clone.id };
        this.plotLabels.push(center);
      }

    });

    let featureCollection = turf.featureCollection(this.plots.concat(this.plotLabels));
    featureCollection = turf.transformRotate(featureCollection, this.angle, {pivot: this.origin});

    this.map.addSource(
      'plots',
      {
        type: 'geojson',
        data: featureCollection
      }
    );

    this.map.addLayer({
      id: 'plotsFill',
      type: 'fill',
      source: 'plots',
      layout: {},
      paint: {
        'fill-color': '#007701',
        'fill-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0.3
        ]

      },
      filter: ['==', '$type', 'Polygon'],
      minzoom: this.plotsMinZoom,
    });

    this.map.addLayer({
      id: 'plotsOutline',
      type: 'line',
      source: 'plots',
      layout: {},
      paint: {
        'line-color': '#007701',
        'line-width': 2,
      },
      filter: ['==', '$type', 'Polygon'],
      minzoom: this.plotsMinZoom,
    });

    if (this.is3d) {
      this.map.addLayer({
        id: 'plotsExtrusion',
        type: 'fill-extrusion',
        source: 'plots',
        paint: {
          'fill-extrusion-color': '#007701',

          'fill-extrusion-height': 1, //['get', 'height'],

          'fill-extrusion-base': 0, // ['get', 'base_height'],

          'fill-extrusion-opacity': 0.6
        },
        filter: ['==', '$type', 'Polygon'],
        minzoom: this.plotsMinZoom,
      });
    }

    this.map.addLayer({
      id: 'plotsLabel',
      type: 'symbol',
      source: 'plots',
      layout: {
        'text-field': ['format', ['get', 'label'], { 'font-size': 1 }],
        'text-offset': [0, 0],
        'text-anchor': 'center',
        // 'text-rotate': this.angle - 90
      },
      filter: ['==', '$type', 'Point'],
      minzoom: this.plotsMinZoom + 1,
    });

    this.map.addLayer(
      {
        id: 'highlighted',
        type: 'line',
        source: 'plots',
        //'source-layer': 'plotsFill',
        paint: {
          'line-color': '#ea0000',
          'line-width': 4,
        },
        filter: ['in', 'label', ''],
        minzoom: this.plotsMinZoom,
      },
    );

    this.map.on('click', (e) => {

      const bbox = [
        [e.point.x, e.point.y],
        [e.point.x, e.point.y]
      ];

      const selectedFeatures = this.map.queryRenderedFeatures(bbox, {
        layers: ['plotsFill']
      });
      const labels = selectedFeatures.map(
        (feature) => feature.properties.label
      );

      this.map.setFilter('highlighted', ['in', 'label', ...labels]);
    });

    this.map.on('mousemove', 'plotsFill', (e) => {
      if (e.features.length > 0) {
        if (this.hoveredPolygonId !== null) {
          this.map.setFeatureState(
            { source: 'plots', id: this.hoveredPolygonId },
            { hover: false }
          );
        }
        this.hoveredPolygonId = e.features[0].id;
        this.map.setFeatureState(
          { source: 'plots', id: this.hoveredPolygonId },
          { hover: true }
        );
      }
    });

    this.map.on('mouseleave', 'plotsFill', () => {
      if (this.hoveredPolygonId !== null) {
        this.map.setFeatureState(
          { source: 'plots', id: this.hoveredPolygonId },
          { hover: false }
        );
      }
      this.hoveredPolygonId = null;
    });


    this.map.fitBounds(turf.bbox(featureCollection), {
      pitch: this.is3d ? 80: 0,
      bearing: this.is3d ? this.angle + 20: 0,
    });

  }

  private generateAlleyLines() {

    let startPointAlley = turf.transformTranslate(this.origin, this.config.plotLength + this.config.yGap/2, 0, this.options);
    startPointAlley = turf.transformTranslate(startPointAlley, this.config.xGap/2, 270, this.options);
    let endPointAlley: Feature<Point> = structuredClone(startPointAlley);
    endPointAlley = turf.transformTranslate(endPointAlley, this.getContainerWidth(), 90, this.options);

    const alleyLine = turf.lineString([startPointAlley.geometry.coordinates, endPointAlley.geometry.coordinates]);
    this.alleyLines.push(alleyLine);

    for (let i = 1; i <= this.config.yCount - 2; i++) {
      let clone: Feature<LineString> = structuredClone(alleyLine);
      clone = turf.transformTranslate(clone, (this.config.plotLength + this.config.yGap) * i, 0, this.options);
      this.alleyLines.push(clone);
    }

    const alleyLinesFC = turf.transformRotate(turf.featureCollection(this.alleyLines), this.angle, {pivot: this.origin});

    this.map.addSource(
      'alleyLines',
      {
        type: 'geojson',
        data: alleyLinesFC
      }
    );

    this.map.addLayer({
      id: 'alleyLines',
      type: 'line',
      source: 'alleyLines',
      layout: {},
      paint: {
        'line-color': '#d20085',
        'line-width': 2,
      }
    });
  }

  private generateSowingLines() {

    let startPoint = turf.transformTranslate(this.origin, this.config.workingWidth/2, 90, this.options);
    startPoint = turf.transformTranslate(startPoint, this.config.yGap/2, 180, this.options);
    let endPoint: Feature<Point> = structuredClone(startPoint);
    endPoint = turf.transformTranslate(endPoint, this.getContainerHeight(), 0, this.options);

    const line = turf.lineString([startPoint.geometry.coordinates, endPoint.geometry.coordinates]);
    this.sowingLines.push(line);

    for (let i = 1; i <= this.config.xCount - 1; i++) {
      let clone: Feature<LineString> = structuredClone(line);
      clone = turf.transformTranslate(clone, (this.config.workingWidth + this.config.xGap) * i, 90, this.options);
      this.sowingLines.push(clone);
    }

    const sowingLinesFC = turf.transformRotate(turf.featureCollection(this.sowingLines), this.angle, {pivot: this.origin});

    this.map.addSource(
      'sowingLines',
      {
        type: 'geojson',
        data: sowingLinesFC
      }
    );

    this.map.addLayer({
      id: 'sowingLines',
      type: 'line',
      source: 'sowingLines',
      layout: {},
      paint: {
        'line-color': '#ff7400',
        'line-width': 2,
      }
    });
  }

  private getContainerWidth() {
    return this.config.xCount * (this.config.workingWidth + this.config.xGap)
  }

  private getContainerHeight() {
    return this.config.yCount * (this.config.plotLength + this.config.yGap)
  }

  private getRectGrid() {

    const cellWidth = this.config.workingWidth + this.config.xGap;
    const cellHeight = this.config.plotLength + this.config.yGap;

    const maxXMinY = turf.transformTranslate(this.origin, this.getContainerWidth()+0.001, 90, this.options);
    const maxXMaxY = turf.transformTranslate(maxXMinY, this.getContainerHeight()+0.001, 0, this.options);

    // [minX, minY, maxX, maxY]
    const bbox: BBox = [this.origin.geometry.coordinates[0], this.origin.geometry.coordinates[1], maxXMaxY.geometry.coordinates[0], maxXMaxY.geometry.coordinates[1]];
    const grid = rectangleGrid(bbox, cellWidth, cellHeight, this.options);

    return grid;
  }

  private initMap() {
    this.map = new mapboxgl.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: this.layers[0].style,
      zoom: 12,
      center: this.kwsHQCoords.geometry.coordinates,
    });
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      console.log('map load');

      this.map.on('click', 'polygon', (e) => {
        // this.map.flyTo({
        //   center: turf.centroid(e.features[0]).geometry.coordinates
        // });
        this.map.fitBounds(turf.bbox(e.features[0]), {
          padding: 20
        });
      });

      this.map.on('mouseenter', 'polygon', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'polygon', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('click', 'point', (e) => {
        // this.map.flyTo({
        //   center: e.features[0].geometry.coordinates
        // });
        this.map.fitBounds(turf.bbox(e.features[0]), {
          maxZoom: 18
        });
      });

      this.map.on('mouseenter', 'point', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      this.map.on('mouseleave', 'point', () => {
        this.map.getCanvas().style.cursor = '';
      });

      this.map.on('draw.create', (values) => {
        this.createABLine(values, this.map)
      });
    });
  }

}
