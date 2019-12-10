import {MapObjectModel} from '../../models/map-object.model';
import {UnifiedMapObject} from '../unified-map-object';
import {GooglePoint} from './google-point';
import {GoogleLine} from './google-line';
import {GooglePolygon} from './google-polygon';
import {WktPrimitives} from '../../models/wkt-primitives';
import {WktService} from '../../services/wkt.service';
import {Coordinates} from '../../../core/models/coordinates';
import {UnifiedMapObjectsFactory} from '../unified-map-objects.factory';

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

                return new GooglePoint(mapObject.id, this.mapInstance, {
                    map: this.mapInstance,
                    position: new google.maps.LatLng(point.lat, point.lng),
                });

            case WktPrimitives.LineString:
                const linePath = coordsSet as Coordinates[];

                return new GoogleLine(mapObject.id, this.mapInstance, {
                    map: this.mapInstance,
                    path: linePath.map(coords => new google.maps.LatLng(coords.lat, coords.lng))
                });

            case WktPrimitives.Polygon:
                const paths = coordsSet as Coordinates[][];

                return new GooglePolygon(mapObject.id, this.mapInstance, {
                    map: this.mapInstance,
                    paths: paths.map(path => path
                        .map(coords => new google.maps.LatLng(coords.lat, coords.lng))
                    )
                });
        }
    }
}
