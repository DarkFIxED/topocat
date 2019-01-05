import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GoogleMapProvider } from '../../map-providers/google/google-map-provider';
import { GoogleMapConfigurationStore } from '../../stores/google-map-configuration.store';
import { MapType } from '../../models/map-type';
import { MapStore } from '../../stores/map.store';
import { Coords } from '../../../domain/map/coords';
import { MessageNames } from '../../../infrastructure/message-names';
import { Observable, Subscription } from 'rxjs';
import { Message, MessageBusService } from 'litebus';
import { RouterHelper } from '../../../infrastructure/router-helper';

@Component({
    selector: 'tc-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    providers: [GoogleMapProvider, GoogleMapConfigurationStore]
})
export class MapComponent implements OnInit, OnDestroy {

    public MapType = MapType;
    public activatedMap: MapType;

    private listeners = [];

    private queryParamsSubscription: Subscription;

    constructor(private mapProvider: GoogleMapProvider,
                private mapStore: MapStore,
                private messageBus: MessageBusService,
                private route: ActivatedRoute,
                private router: Router,
                private zone: NgZone) {
        this.queryParamsSubscription = this.route.queryParams.subscribe(queryParams => {
            this.handleQueryParams(queryParams);
        });

        this.setupListeners();
    }


    ngOnInit(): void {
        this.queryParamsSubscription.unsubscribe();
    }

    ngOnDestroy(): void {
        this.messageBus.stopListen(this.listeners);
    }

    public onMapReady($event: any) {
        let zoom = this.mapStore.entity.zoom;
        let center = this.mapStore.entity.center;

        this.mapProvider.setup($event, {zoom: zoom, center: center});
    }

    private handleQueryParams(queryParams: Params) {
        this.handleMapType(queryParams['mapType']);
        this.handleZoom(queryParams['zoom']);
        this.handleCenter(queryParams['lat'], queryParams['lng']);
    }

    private handleMapType(mapType: string) {
        if (!mapType) {
            // TODO: implement default map type.
            this.router.navigate([''], {
                queryParams: {'mapType': MapType[MapType.Google].toLowerCase()},
                queryParamsHandling: 'merge',
                skipLocationChange: false,
                relativeTo: this.route
            });
        } else {
            if (mapType === 'google') {
                this.activatedMap = MapType.Google;
            }
        }
    }

    private handleZoom(zoom: string) {
        if (!!zoom) {
            this.mapStore.entity.setZoom(+zoom);
        }
    }

    private handleCenter(lat: string, lng: string) {
        if (!!lat && !!lng) {
            let newCenter = new Coords(+lat, +lng);
            this.mapStore.entity.setCenter(newCenter);
        }
    }

    private setupListeners() {
        this.setupIdleListener();
    }

    private setupIdleListener() {
        let listenerId = this.messageBus.listen([MessageNames.MapIdle],
            (observer: Observable<Message<{ zoom: number, center: Coords }>>) => {
                return observer.subscribe(message => {
                    this.zone.run(() => {
                        let exactRoute = RouterHelper.getDeepestActivatedRoute(this.route);

                        this.router.navigate(['.'], {
                            queryParams: {
                                zoom: message.payload.zoom.toString(),
                                lat: message.payload.center.lat.toString(),
                                lng: message.payload.center.lng.toString()
                            },
                            relativeTo: exactRoute,
                            queryParamsHandling: 'merge',
                            replaceUrl: true,
                            skipLocationChange: false,
                        });
                    });
                });
            });

        this.listeners.push(listenerId);
    }
}
