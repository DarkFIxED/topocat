import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';
import {ActivatedRoute} from '@angular/router';
import {MapRenderingService} from '../../services/map-rendering.service';
import {MapsSignalRService} from '../../services/maps.signal-r.service';
import {filter, tap} from 'rxjs/operators';
import {BaseDestroyable} from '../../../core/services/base-destroyable';
import {MapObjectsDrawingService} from '../../services/map-objects-drawing.service';
import {MapInstanceService} from '../../services/map-instance.service';
import {EditMapObjectFlow} from '../../services/edit-map-object.flow';
import {ObjectsDrawingFlow} from '../../services/objects-drawing.flow';
import {DrawnObjectsStore} from '../../stores/drawn-objects.store';
import {MapObjectsQuery} from '../../queries/map-objects.query';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [MapRenderingService, MapObjectsDrawingService, MapInstanceService, EditMapObjectFlow, ObjectsDrawingFlow, DrawnObjectsStore]
})
export class MapComponent extends BaseDestroyable implements OnInit {

    private mapId: string = undefined;

    drawing$ = this.mapObjectsQuery.select(state => state.drawing.isEnabled);

    constructor(private mapService: MapService,
                private route: ActivatedRoute,
                private mapsSignalRService: MapsSignalRService,
                private mapInstanceService: MapInstanceService,
                private mapObjectsDrawer: MapRenderingService,
                private editMapObjectFlow: EditMapObjectFlow,
                private objectsDrawingFlow: ObjectsDrawingFlow,
                private mapObjectsQuery: MapObjectsQuery) {
        super();

        this.editMapObjectFlow.setUp();
        this.objectsDrawingFlow.setUp();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.mapId = params.id;

            if (!this.mapId) {
                throw new Error();
            }

            this.mapService.load(this.mapId);

            this.mapsSignalRService.isConnected$.pipe(
                filter(isConnected => !!isConnected),
                tap(() => this.mapsSignalRService.initialize(this.mapId))
            ).subscribe();
        });
    }

    onMapReady(mapInstance: google.maps.Map) {
        this.mapInstanceService.setInstance(mapInstance);
    }
}
