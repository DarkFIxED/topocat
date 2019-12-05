import {Injectable} from '@angular/core';
import * as WKT from 'terraformer-wkt-parser';
import {Coordinates} from '../../core/models/coordinates';
import {WktPrimitives} from '../models/wkt-primitives';
import * as Terraformer from 'terraformer';

@Injectable()
export class WktService {

    getWktType(wktString: string): string {
        const primitive = WKT.parse(wktString);

        return primitive.type;
    }

    createWktString(type: string, coords: Coordinates | Coordinates[] | Coordinates[][]): string {
        switch (type) {
            case WktPrimitives.Point:
                const pointCoords = coords as Coordinates;
                return this.getPoint(pointCoords.lat, pointCoords.lng);

            case WktPrimitives.LineString:
                const path = coords as Coordinates[];
                return this.getLineString(path);

            case WktPrimitives.Polygon:
                const paths = coords as Coordinates[][];
                return this.getPolygon(paths);

            default:
                throw new Error();
        }
    }

    getWktCoords(wktString: string): Coordinates | Coordinates[] | Coordinates[][] {
        const primitive = WKT.parse(wktString);

        switch (primitive.type) {
            case WktPrimitives.Point:
                const point = primitive as Terraformer.Point;
                return new Coordinates(point.coordinates[1], point.coordinates[0]);

            case WktPrimitives.LineString:
                const lineString = primitive as Terraformer.LineString;
                return lineString.coordinates.map(coords => new Coordinates(coords[1], coords[0]));

            case WktPrimitives.Polygon:
                const polygon = primitive as Terraformer.Polygon;
                return polygon.coordinates.map(path => path.filter(coords => path.indexOf(coords) !== path.length - 1).map(coords => new Coordinates(coords[1], coords[0])));

            default:
                throw new Error();
        }
    }

    getPoint(lat: number, lng: number): string {
        return WKT.convert({
            type: WktPrimitives.Point,
            coordinates: [lng, lat]
        });
    }

    getLineString(path: Coordinates[]): string {
        return WKT.convert({
            type: WktPrimitives.LineString,
            coordinates: [...path.map(coords => [coords.lng, coords.lat])]
        });
    }

    getPolygon(paths: Coordinates[][]): string {
        return WKT.convert({
            type: WktPrimitives.Polygon,
            coordinates: paths.map(path => {
                const arr = path.map(coords => [coords.lng, coords.lat]);
                arr.push([path[0].lng, path[0].lat]);
                return arr;
            })
        });
    }
}
