import {MapObjectModel} from '../models/map-object.model';
import {UnifiedMapObject} from '../models/unified-map-object';
import {Point} from '../models/point';
import {Line} from '../models/line';
import {Polygon} from '../models/polygon';
import {WktPrimitives} from '../models/wkt-primitives';
import {WktService} from '../services/wkt.service';
import {Coordinates} from '../../core/models/coordinates';
import {UnifiedMapObjectsFactory} from './unified-map-objects.factory';

export class GoogleUnifiedMapObjectsFactory implements UnifiedMapObjectsFactory {

    constructor(private wktService: WktService,
                private mapInstance: google.maps.Map) {
    }

    build(mapObject: MapObjectModel): UnifiedMapObject {
        const type = this.wktService.getWktType(mapObject.wktString);
        const coordsSet = this.wktService.getWktCoords(mapObject.wktString);

        switch (type) {
            case WktPrimitives.Point:
                const point = coordsSet as Coordinates;

                return new Point(mapObject.id, {
                    map: this.mapInstance,
                    position: new google.maps.LatLng(point.lat, point.lng),
                });

            case WktPrimitives.LineString:
                const linePath = coordsSet as Coordinates[];

                return new Line(mapObject.id, {
                    map: this.mapInstance,
                    path: linePath.map(coords => new google.maps.LatLng(coords.lat, coords.lng))
                });

            case WktPrimitives.Polygon:
                const paths = coordsSet as Coordinates[][];

                return new Polygon(mapObject.id, {
                    map: this.mapInstance,
                    paths: paths.map(path => path
                        .map(coords => new google.maps.LatLng(coords.lat, coords.lng))
                    )
                });
        }
    }
}
