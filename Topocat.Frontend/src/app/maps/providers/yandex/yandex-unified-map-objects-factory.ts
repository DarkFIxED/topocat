import {UnifiedMapObjectsFactory} from '../unified-map-objects.factory';
import {MapObjectModel} from '../../models/map-object.model';
import {UnifiedMapObject} from '../unified-map-object';
import {YandexPoint} from './yandex-point';
import {WktService} from '../../services/wkt.service';
import {WktPrimitives} from '../../models/wkt-primitives';
import {Coordinates} from '../../../core/models/coordinates';
import {GooglePoint} from '../google/google-point';
import {GoogleLine} from '../google/google-line';
import {GooglePolygon} from '../google/google-polygon';
import {map} from 'rxjs/operators';

export class YandexUnifiedMapObjectsFactory implements UnifiedMapObjectsFactory{

    constructor(private mapInstance: any, private wktService: WktService) {
    }

    build(mapObject: MapObjectModel): UnifiedMapObject {
        const type = this.wktService.getWktType(mapObject.wktString);
        const coordsSet = this.wktService.getWktCoords(mapObject.wktString);

        switch (type) {

            case WktPrimitives.Point:
                const point = coordsSet as Coordinates;

                const yaPoint = new YandexPoint(mapObject.id, {
                    lat: point.lat,
                    lng: point.lng,
                    title: mapObject.title
                });

                this.mapInstance.geoObjects.add(yaPoint.getUnderlyingObject());
                return yaPoint;

            case WktPrimitives.LineString:
            case WktPrimitives.Polygon:
                return new YandexPoint(mapObject.id, {
                    lat: 0,
                    lng: 0,
                    title: mapObject.title
                });
        }
    }

}
