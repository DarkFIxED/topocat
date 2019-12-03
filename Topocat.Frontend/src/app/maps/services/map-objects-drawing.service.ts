import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {MapInstanceService} from './map-instance.service';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {MapObjectModel} from '../models/map-object.model';
import {WktService} from './wkt.service';
import {DrawnObjectsStore} from '../stores/drawn-objects.store';
import {UnifiedMapObject} from '../models/unified-map-object';
import {Coordinates} from '../../core/models/coordinates';
import {WktPrimitives} from '../models/wkt-primitives';
import {MapObjectHelper} from '../helpers/map-object.helper';

@Injectable()
export class MapObjectsDrawingService {
    private drawingManager = new BehaviorSubject<google.maps.drawing.DrawingManager>(undefined);

    private mapInstance: google.maps.Map;

    constructor(private mapInstanceService: MapInstanceService,
                private mapObjectsQuery: MapObjectsQuery,
                private wktService: WktService,
                private drawnObjectsStore: DrawnObjectsStore) {
        this.initialize();
    }

    initialize() {
        this.mapInstanceService.mapInstance$.pipe(
            filter(instance => !!instance),
            tap(() => {
                const drawingManager = new google.maps.drawing.DrawingManager({
                    map: null,
                    drawingControl: false,
                });

                this.drawingManager.next(drawingManager);
            }),
            tap(instance => {
                this.mapInstance = instance;
            })
        ).subscribe();
    }

    changeFigure(mapObject: MapObjectModel): Observable<MapObjectModel> {

        let foundObject: UnifiedMapObject;
        this.drawnObjectsStore.drawnObjects.forEach(drawnObject => {
            if (drawnObject.id === mapObject.id) {
                foundObject = drawnObject;
                drawnObject.allowChange();
            } else {
                drawnObject.disable();
            }
        });

        if (!foundObject) {
            throw new Error();
        }

        const type = this.wktService.getWktType(mapObject.wktString);
        return foundObject.drag$.pipe(
            map(coords => this.mapWktString(type, coords)),
            map(wktString => {
                return MapObjectHelper.copyWithAnotherWktString(mapObject, wktString);
            })
        );
    }

    stopChangeFigure(mapObject: MapObjectModel) {
        this.drawnObjectsStore.drawnObjects.forEach(drawnObject => {
            if (drawnObject.id === mapObject.id) {
                drawnObject.disallowChange();
            } else {
                drawnObject.enable();
            }
        });
    }

    private mapWktString(type: string, coords: Coordinates | Coordinates[] | Coordinates[][]): string {
        switch (type) {
            case WktPrimitives.Point:
                const pointCoords = coords as Coordinates;
                return this.wktService.getPoint(pointCoords.lat, pointCoords.lng);

            case WktPrimitives.LineString:
                const path = coords as Coordinates[];
                return this.wktService.getLineString(path);

            case WktPrimitives.Polygon:
                const paths = coords as Coordinates[][];
                return this.wktService.getPolygon(paths);

            default:
                throw new Error();
        }
    }

    drawFigure(type: string, mapObject: MapObjectModel): Promise<MapObjectModel> {
        return new Promise<MapObjectModel>((resolve => {
            const drawingManager = this.drawingManager.getValue();

            switch (type) {
                case WktPrimitives.Point:
                    this.drawPoint(drawingManager, mapObject, resolve);
                    break;

                case WktPrimitives.LineString:
                    this.drawLineString(drawingManager, mapObject, resolve);
                    break;

                case WktPrimitives.Polygon:
                    this.drawPolygon(drawingManager, mapObject, resolve);
                    break;

                default:
                    throw new Error();
            }
        }));
    }

    private drawPoint(drawingManager: google.maps.drawing.DrawingManager, mapObject: MapObjectModel, resolveFunc: (result?: any) => void) {
        drawingManager.setOptions({
            drawingControl: false,
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            map: this.mapInstance
        });

        const listener = drawingManager.addListener('markercomplete', (marker: google.maps.Marker) => {
            listener.remove();
            drawingManager.setMap(null);
            marker.setMap(null);

            const position = marker.getPosition();
            const wktString = this.wktService.getPoint(position.lat(), position.lng());

            resolveFunc({
                id: mapObject.id,
                createdAt: mapObject.createdAt,
                lastModifiedAt: mapObject.lastModifiedAt,
                title: mapObject.title,
                description: mapObject.description,
                wktString
            });
        });
    }

    private drawLineString(drawingManager: google.maps.drawing.DrawingManager, mapObject: MapObjectModel, resolveFunc: (result?: any) => void) {
        drawingManager.setOptions({
            drawingControl: false,
            drawingMode: google.maps.drawing.OverlayType.POLYLINE,
            map: this.mapInstance
        });

        const listener = drawingManager.addListener('polylinecomplete', (polyline: google.maps.Polyline) => {
            listener.remove();
            drawingManager.setMap(null);
            polyline.setMap(null);

            const path = polyline.getPath().getArray().map(latLng => new Coordinates(latLng.lat(), latLng.lng()));
            const wktString = this.wktService.getLineString(path);

            resolveFunc({
                id: mapObject.id,
                createdAt: mapObject.createdAt,
                lastModifiedAt: mapObject.lastModifiedAt,
                title: mapObject.title,
                description: mapObject.description,
                wktString
            });
        });
    }

    private drawPolygon(drawingManager: google.maps.drawing.DrawingManager, mapObject: MapObjectModel, resolveFunc: (result?: any) => void) {
        drawingManager.setOptions({
            drawingControl: false,
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            map: this.mapInstance
        });

        const listener = drawingManager.addListener('polygoncomplete', (polygon: google.maps.Polygon) => {
            listener.remove();
            drawingManager.setMap(null);
            polygon.setMap(null);

            const paths = polygon.getPaths().getArray().map(path => path.getArray().map(latLng => new Coordinates(latLng.lat(), latLng.lng())));
            const wktString = this.wktService.getPolygon(paths);

            resolveFunc({
                id: mapObject.id,
                createdAt: mapObject.createdAt,
                lastModifiedAt: mapObject.lastModifiedAt,
                title: mapObject.title,
                description: mapObject.description,
                wktString
            });
        });
    }
}
