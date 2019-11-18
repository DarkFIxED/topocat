import {MapObjectModel} from './map-object.model';
import {UnifiedMapObject} from './unified-map-object';
import {Point} from './point';
import * as WKT from 'terraformer-wkt-parser';
import * as Terraformer from 'terraformer';
import {Line} from './line';
import {Polygon} from './polygon';
import {Injectable} from '@angular/core';
import {WktPrimitives} from './wkt-primitives';

@Injectable()
export class UnifiedMapObjectsFactory {

    build(map: google.maps.Map, mapObject: MapObjectModel): UnifiedMapObject {
        const primitive = WKT.parse(mapObject.wktString);

        switch (primitive.type) {
            case WktPrimitives.Point:
                const point = primitive as Terraformer.Point;
                return new Point(mapObject.id, {
                    map,
                    position: new google.maps.LatLng(point.coordinates[1], point.coordinates[0]),
                });

            case WktPrimitives.LineString:
                const lineString = primitive as Terraformer.LineString;

                return new Line(mapObject.id, {
                    map,
                    path: lineString.coordinates.map(coords => new google.maps.LatLng(coords[1], coords[0]))
                });

            case WktPrimitives.Polygon:
                const polygon = primitive as Terraformer.Polygon;

                return new Polygon(mapObject.id, {
                    map,
                    paths: polygon.coordinates.map(path => path.map(coords => new google.maps.LatLng(coords[1], coords[0])))
                });
        }
    }
}