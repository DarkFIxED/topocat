import {MapObjectModel} from './map-object.model';
import {UnifiedMapObject} from './unified-map-object';
import {Point} from './point';
import * as Terraformer from 'terraformer';
import {Line} from './line';
import {Polygon} from './polygon';
import {Injectable} from '@angular/core';
import {WktPrimitives} from './wkt-primitives';
import {WktService} from '../services/wkt.service';
import {Coordinates} from '../../core/models/coordinates';

@Injectable()
export class UnifiedMapObjectsFactory {

    constructor(private wktService: WktService) {
    }

    build(map: google.maps.Map, mapObject: MapObjectModel): UnifiedMapObject {

        const type = this.wktService.getWktType(mapObject.wktString);
        const coordsSet = this.wktService.getWktCoords(mapObject.wktString);

        switch (type) {
            case WktPrimitives.Point:
                const point = coordsSet as Coordinates;

                return new Point(mapObject.id, {
                    map,
                    position: new google.maps.LatLng(point.lat, point.lng),
                });

            case WktPrimitives.LineString:
                const linePath = coordsSet as Coordinates[];

                return new Line(mapObject.id, {
                    map,
                    path: linePath.map(coords => new google.maps.LatLng(coords.lat, coords.lng))
                });

            case WktPrimitives.Polygon:
                const paths = coordsSet as Coordinates[][];

                return new Polygon(mapObject.id, {
                    map,
                    paths: paths.map(path => path
                        .map(coords => new google.maps.LatLng(coords.lat, coords.lng))
                    )
                });
        }
    }
}
