import {Component, OnInit} from '@angular/core';
import {MapObjectsService} from '../../services/map-objects.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MapRenderingService} from '../../services/map-rendering.service';
import {MapsSignalRService} from '../../services/maps.signal-r.service';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {BaseDestroyable} from '../../../core/services/base-destroyable';
import {MapObjectsDrawingService} from '../../services/map-objects-drawing.service';
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
import {MapService} from '../../services/map.service';
import {MapProviderService} from '../../services/map-provider.service';
import {MapQuery} from '../../queries/map.query';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [
        MapRenderingService,
        MapObjectsDrawingService,
        EditMapObjectFlow,
        ObjectsDrawingFlow,
        DrawnObjectsStore,
        CreateMapObjectFlow,
        MapPositionFlow,
        ShowMapObjectPropertiesFlow,
        MapFlowsService,
        MapRemovedFlow,
        MapModeFlow,
        MapProviderService
    ]
})
export class MapComponent extends BaseDestroyable implements OnInit {
    private mapId: string = undefined;

    drawing$ = this.mapObjectsQuery.select(state => state.drawing.isEnabled);

    constructor(private mapObjectsService: MapObjectsService,
                private route: ActivatedRoute,
                private mapsSignalRService: MapsSignalRService,
                private mapRenderingService: MapRenderingService,
                private mapObjectsQuery: MapObjectsQuery,
                private mapService: MapService,
                private mapFlowsService: MapFlowsService,
                private mapProviderService: MapProviderService,
                private router: Router,
                private mapQuery: MapQuery) {
        super();
        this.mapFlowsService.setUp();
    }

    ngOnInit() {
        this.setFirstAvailableMapProviderIfNothingSpecified();
        this.initialize();
    }

    private initialize() {
        this.route.params.subscribe(params => {
            this.mapId = params.id;

            if (!this.mapId) {
                throw new Error();
            }

            this.mapObjectsService.load(this.mapId);
            this.mapService.load(this.mapId);

            this.mapsSignalRService.isConnected$.pipe(
                filter(isConnected => !!isConnected),
                tap(() => this.mapsSignalRService.initialize(this.mapId))
            ).subscribe();
        });

        this.componentAlive$.subscribe(() => {
            this.mapObjectsService.reset();
            this.mapService.reset();
        });

        this.mapProviderService.provider$.pipe(
            tap(() => this.trySetCurrentPosition()),
            takeUntil(this.componentAlive$)
        ).subscribe();
    }

    private trySetCurrentPosition() {
        if (!!navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const zoomLevel = this.mapProviderService.getProvider().getDefaultZoomLevel();
                this.mapService.setMapPosition(position.coords.latitude, position.coords.longitude, zoomLevel);
            });
        }
    }

    private setFirstAvailableMapProviderIfNothingSpecified() {
        this.mapQuery.select(state => state.providers)
            .pipe(
                filter(providers => !!providers),
                tap(providers => {
                    if (!this.route.children.length) {
                        const providersList = Object.getOwnPropertyNames(providers).map(property => {
                            return {
                                provider: property,
                                isAvailable: providers[property]
                            };
                        });

                        const firstAvailableProvider = providersList.find(item => !!item.isAvailable);
                        this.router.navigate([firstAvailableProvider.provider.toLowerCase()], {relativeTo: this.route});
                    }
                }),
                takeUntil(this.componentAlive$)
            ).subscribe();
    }
}
