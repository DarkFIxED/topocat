import {UnifiedMapObjectsFactory} from '../unified-map-objects.factory';
import {MapObjectModel} from '../../models/map-object.model';
import {UnifiedMapObject} from '../unified-map-object';
import {YandexPoint} from './yandex-point';
import {WktService} from '../../services/wkt.service';
import {WktPrimitives} from '../../models/wkt-primitives';
import {Coordinates} from '../../../core/models/coordinates';
import {YandexLine} from './yandex-line';
import {YandexPolygon} from './yandex-polygon';

export class YandexUnifiedMapObjectsFactory implements UnifiedMapObjectsFactory {

    constructor(private mapInstance: any, private wktService: WktService) {
    }

    build(mapObject: MapObjectModel): UnifiedMapObject {
        const type = this.wktService.getWktType(mapObject.wktString);
        const coordsSet = this.wktService.getWktCoords(mapObject.wktString);

        switch (type) {

            case WktPrimitives.Point:
                const point = coordsSet as Coordinates;

                const yaPoint = new YandexPoint(mapObject.id, this.mapInstance, {
                    lat: point.lat,
                    lng: point.lng,
                    title: mapObject.title
                });

                this.mapInstance.geoObjects.add(yaPoint.getUnderlyingObject());
                return yaPoint;

            case WktPrimitives.LineString:
                const path = coordsSet as Coordinates[];

                const yandexPath = path.map(pathPoint => [pathPoint.lat, pathPoint.lng]);
                const yaLine = new YandexLine(mapObject.id, this.mapInstance, {
                    path: yandexPath
                });

                this.mapInstance.geoObjects.add(yaLine.getUnderlyingObject());
                return yaLine;

            case WktPrimitives.Polygon:
                const paths = coordsSet as Coordinates[][];

                const convertedPaths = paths.map(p => p.map(c => [c.lat, c.lng]));

                const yaPolygon = new YandexPolygon(mapObject.id, this.mapInstance, {
                    paths: convertedPaths
                });
                this.mapInstance.geoObjects.add(yaPolygon.getUnderlyingObject());

                return yaPolygon;
        }
    }

}
