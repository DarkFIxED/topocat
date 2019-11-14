import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {MapInstanceService} from './map-instance.service';
import {MapObjectsQuery} from '../queries/map-objects.query';
import {MapObjectModel} from '../models/map-object.model';
import {WktService} from './wkt.service';

@Injectable()
export class NewMapObjectsDrawer {

    private drawingManager = new BehaviorSubject<google.maps.drawing.DrawingManager>(undefined);
    drawingManager$ = this.drawingManager.asObservable();

    private map: google.maps.Map;

    constructor(private mapInstanceService: MapInstanceService,
                private mapObjectsQuery: MapObjectsQuery,
                private wktService: WktService) {
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
                this.map = instance;
            })
        ).subscribe();
    }

    async redrawFigure(mapObject: MapObjectModel): Promise<MapObjectModel> {

        const drawingManager = this.drawingManager.getValue();
        const objectType = this.wktService.getWktType(mapObject.wktString);

        const self = this;

        switch (objectType) {
            case 'Point':
                drawingManager.setOptions({
                    drawingControl: false,
                    drawingMode: google.maps.drawing.OverlayType.MARKER,
                    map: this.map
                });

                const listener = drawingManager.addListener('markercomplete', function(marker: google.maps.Marker) {
                    listener.remove();

                    const position = marker.getPosition();
                    mapObject.wktString = self.wktService.getPoint(position.lat(), position.lng());

                    return mapObject;
                });
                break;

            case 'LineString':
                return mapObject;

            default:
                throw new Error();
        }
    }
}
