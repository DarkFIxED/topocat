import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';
import {ActivatedRoute} from '@angular/router';
import {MapRenderingService} from '../../services/map-rendering.service';
import {MapsSignalRService} from '../../services/maps.signal-r.service';
import {filter, tap} from 'rxjs/operators';
import {BaseDestroyable} from '../../../core/services/base-destroyable';
import {NewMapObjectsDrawer} from '../../services/new-map-objects.drawer';
import {MapInstanceService} from '../../services/map-instance.service';
import {EditMapObjectFlow} from '../../services/edit-map-object.flow';
import {ObjectsDrawingFlow} from '../../services/objects-drawing.flow';
import {DrawnObjectsStore} from '../../stores/drawn-objects.store';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [MapRenderingService, NewMapObjectsDrawer, MapInstanceService, EditMapObjectFlow, ObjectsDrawingFlow, DrawnObjectsStore]
})
export class MapComponent extends BaseDestroyable implements OnInit {

    private mapId: string = undefined;

    constructor(private mapService: MapService,
                private route: ActivatedRoute,
                private mapsSignalRService: MapsSignalRService,
                private mapInstanceService: MapInstanceService,
                private mapObjectsDrawer: MapRenderingService,
                private editMapObjectFlow: EditMapObjectFlow,
                private objectsDrawingFlow: ObjectsDrawingFlow) {
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
