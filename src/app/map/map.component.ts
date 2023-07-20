import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile'; 
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from 'ol/proj';
import { Geojson } from '../inaturalist/inaturalist.interface';
import Point from 'ol/geom/Point.js';
import Feature from 'ol/Feature.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { style } from '@angular/animations';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  @Input() geojson!: Geojson;
  @Input() obscured!: boolean;
  map: any;
  private iconStyle!: Style;

  constructor(private location: Location){
    let url = this.location.prepareExternalUrl('/assets/icons/icon-72x72.png')

    this.iconStyle = new Style({
      image: new Icon({
        src: url,
        scale: 0.5,
        anchor: [0.2,0.8]
      }),
    });

  }

  ngOnInit(): void {
    let coordinates = fromLonLat(this.geojson.coordinates)

    let vl = new VectorLayer({
      source: new VectorSource({
        features: [
            new Feature({
              geometry: new Point(coordinates)
            })
          ]
        }),
      style: this.iconStyle
    });

    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        }),
        vl
      ],
      view: new View({
        center: coordinates,
        zoom: 9
      })
    });

  }

  

}
