import {Injectable} from '@angular/core';
import * as WKT from 'terraformer-wkt-parser';
import {Coordinates} from '../../core/models/coordinates';

@Injectable()
export class WktService {
    getWktType(wktString: string): string {
        const primitive = WKT.parse(wktString);

        return primitive.type;
    }

    getPoint(lat: number, lng: number): string {
        return WKT.convert({
            type: 'Point',
            coordinates: [lng, lat]
        });
    }

    getLineString(path: Coordinates[]): string {
        return WKT.convert({
            type: 'LineString',
            coordinates: [...path.map(coords => [coords.lng, coords.lat])]
        });
    }

    getPolygon(paths: Coordinates[][]): string {
        return WKT.convert({
            type: 'Polygon',
            coordinates: paths.map(path => {
                const arr = path.map(coords => [coords.lng, coords.lat]);
                arr.push([path[0].lng, path[0].lat]);
                return arr;
            })
        });
    }
}
