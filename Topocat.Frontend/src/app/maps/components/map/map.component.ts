import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';
import {ActivatedRoute} from '@angular/router';
import {DrawMapObjectsFlow} from '../../services/draw-map-objects-flow';
import {MapsSignalRService} from '../../services/maps.signal-r.service';
import {filter, tap} from 'rxjs/operators';
import {BaseDestroyable} from '../../../core/services/base-destroyable';
import {NewMapObjectsDrawer} from '../../services/new-map-objects.drawer';
import {MapInstanceService} from '../../services/map-instance.service';
import {EditMapObjectFlow} from '../../services/edit-map-object.flow';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [DrawMapObjectsFlow, NewMapObjectsDrawer, MapInstanceService, EditMapObjectFlow]
})
export class MapComponent extends BaseDestroyable implements OnInit {

    private mapId: string = undefined;

    constructor(private mapService: MapService,
                private route: ActivatedRoute,
                private mapsSignalRService: MapsSignalRService,
                private mapInstanceService: MapInstanceService,
                private mapObjectsDrawer: DrawMapObjectsFlow,
                private editMapObjectFlow: EditMapObjectFlow) {
        super();

        this.editMapObjectFlow.setUp();
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
