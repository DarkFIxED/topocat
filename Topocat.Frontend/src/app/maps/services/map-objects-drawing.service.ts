import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';
import {MapInstanceService} from './map-instance.service';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {MapObjectModel} from '../models/map-object.model';
import {WktService} from './wkt.service';
import {DrawnObjectsStore} from '../stores/drawn-objects.store';
import {MapRenderingService} from './map-rendering.service';
import {UnifiedMapObject} from '../models/unified-map-object';
import {Coordinates} from '../../core/models/coordinates';
import {WktPrimitives} from '../models/wkt-primitives';

@Injectable()
export class MapObjectsDrawingService {
    private drawingManager = new BehaviorSubject<google.maps.drawing.DrawingManager>(undefined);

    private mapInstance: google.maps.Map;

    constructor(private mapInstanceService: MapInstanceService,
                private mapObjectsQuery: MapObjectsQuery,
                private wktService: WktService,
                private drawnObjectsStore: DrawnObjectsStore,
                private mapRenderingService: MapRenderingService) {
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

        if (!foundObject)
            throw new Error();

        const type = this.wktService.getWktType(mapObject.wktString);
        return foundObject.drag$.pipe(
            map(coords => this.mapWktString(type, coords)),
            map(wktString => {
                return {
                    id: mapObject.id,
                    title: mapObject.title,
                    createdAt: mapObject.createdAt,
                    lastModifiedAt: mapObject.lastModifiedAt,
                    wktString
                };
            })
        );
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
                return  this.wktService.getPolygon(paths);

            default:
                throw new Error();
        }
    }

    drawFigure(mapObject: MapObjectModel): Promise<MapObjectModel> {
        return new Promise<MapObjectModel>((resolve => {
            const drawingManager = this.drawingManager.getValue();
            const objectType = this.wktService.getWktType(mapObject.wktString);

            switch (objectType) {
                case WktPrimitives.Point:
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

                        resolve({
                            id: mapObject.id,
                            createdAt: mapObject.createdAt,
                            lastModifiedAt: mapObject.lastModifiedAt,
                            title: mapObject.title,
                            wktString
                        });
                    });
                    break;

                case 'LineString':
                    return mapObject;

                default:
                    throw new Error();

            }
        }));
    }
}
