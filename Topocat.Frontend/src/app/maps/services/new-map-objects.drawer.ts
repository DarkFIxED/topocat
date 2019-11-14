import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, tap} from 'rxjs/operators';
import {MapInstanceService} from './map-instance.service';
import {MapObjectsQuery} from '../queries/map-objects.query';

@Injectable()
export class NewMapObjectsDrawer {

    private drawingManager = new BehaviorSubject<google.maps.drawing.DrawingManager>(undefined);
    drawingManager$ = this.drawingManager.asObservable();

    private map$: Observable<google.maps.Map>;

    constructor(private mapInstanceService: MapInstanceService,
                private mapObjectsQuery: MapObjectsQuery) {
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
            })
        ).subscribe();
    }
}
