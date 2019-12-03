import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';
import {ActivatedRoute} from '@angular/router';
import {MapRenderingService} from '../../services/map-rendering.service';
import {MapsSignalRService} from '../../services/maps.signal-r.service';
import {filter, tap} from 'rxjs/operators';
import {BaseDestroyable} from '../../../core/services/base-destroyable';
import {MapObjectsDrawingService} from '../../services/map-objects-drawing.service';
import {MapInstanceService} from '../../services/map-instance.service';
import {EditMapObjectFlow} from '../../flows/edit-map-object.flow';
import {ObjectsDrawingFlow} from '../../flows/objects-drawing.flow';
import {DrawnObjectsStore} from '../../stores/drawn-objects.store';
import {MapObjectsQuery} from '../../queries/map-objects.query';
import {CreateMapObjectFlow} from '../../flows/create-map-object.flow';
import {MapPositionFlow} from '../../flows/map-position.flow';
import {MapFlowsService} from '../../services/map-flows.service';
import {ShowMapObjectPropertiesFlow} from '../../flows/show-map-object-properties.flow';
import {MapRemovedFlow} from '../../flows/map-removed.flow';
import {MapModeFlow} from '../../flows/map-mode.flow';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [
        MapRenderingService,
        MapObjectsDrawingService,
        MapInstanceService,
        EditMapObjectFlow,
        ObjectsDrawingFlow,
        DrawnObjectsStore,
        CreateMapObjectFlow,
        MapPositionFlow,
        ShowMapObjectPropertiesFlow,
        MapFlowsService,
        MapRemovedFlow,
        MapModeFlow
    ]
})
export class MapComponent extends BaseDestroyable implements OnInit {

    // TODO: extract to constants.
    private readonly defaultZoomLevelForUserPosition = 12;

    private mapId: string = undefined;

    drawing$ = this.mapObjectsQuery.select(state => state.drawing.isEnabled);

    constructor(private mapService: MapService,
                private route: ActivatedRoute,
                private mapsSignalRService: MapsSignalRService,
                private mapInstanceService: MapInstanceService,
                private mapObjectsDrawer: MapRenderingService,
                private mapObjectsQuery: MapObjectsQuery,
                private mapFlowsService: MapFlowsService) {
        super();
        this.mapFlowsService.setUp();
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

        this.componentAlive$.subscribe(() => this.mapService.reset());
    }

    onMapReady(mapInstance: google.maps.Map) {
        this.mapInstanceService.setInstance(mapInstance);
        this.mapService.setMapInstanceLoaded();
        this.trySetCurrentPosition();
    }

    private trySetCurrentPosition() {
        if (!!navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
               this.mapService.setPosition(position.coords.latitude, position.coords.longitude, this.defaultZoomLevelForUserPosition);
            });
        }
    }
}
