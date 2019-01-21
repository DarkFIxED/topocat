import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GoogleMapProvider } from '../../map-providers/google/google-map-provider';
import { GoogleMapConfigurationStore } from '../../stores/google-map-configuration.store';
import { MapType } from '../../models/map-type';
import { MapStore } from '../../stores/map.store';
import { Coords } from '../../../domain/map/coords';
import { MessageNames } from '../../../infrastructure/message-names';
import { Observable, Subscription } from 'rxjs';
import { Message, MessageBusService, SimpleMessage } from 'litebus';
import { RouterHelper } from '../../../infrastructure/router-helper';
import { CenterChangedEventArgs } from '../../../domain/map/event-args/center-changed.event-args';
import { filter } from 'rxjs/operators';
import { ZoomChangedEventArgs } from '../../../domain/map/event-args/zoom-changed.event-args';
import { MapObject } from '../../../domain/map/map-object';

@Component({
    selector: 'tc-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
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

    public onMapReady(map: any) {
        let zoom = this.mapStore.entity.zoom;
        let center = this.mapStore.entity.center;

        this.setupMapProvider(map, {zoom: zoom, center: center});
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
        this.setupActivatePopupListener();
        this.setupDeactivatePopupListener();

        this.setupMapObjectAddedListener();
        this.setupCenterChangedListener();
        this.setupZoomChangedListener();
        this.setupMapObjectDeletedListener();
    }

    private updateQueryString(zoom: number, center: Coords) {
        this.zone.run(() => {
            let exactRoute = RouterHelper.getDeepestActivatedRoute(this.route);

            this.router.navigate(['.'], {
                queryParams: {
                    zoom: zoom.toString(),
                    lat: center.lat.toString(),
                    lng: center.lng.toString()
                },
                relativeTo: exactRoute,
                queryParamsHandling: 'merge',
                replaceUrl: true,
                skipLocationChange: false,
            });
        });
    }

    private setupActivatePopupListener() {
        let listenerId = this.messageBus.listen([MessageNames.MapActivatePopup],
            (observable: Observable<Message<string[]>>) => {
                return observable.subscribe(message => {
                    this.router.navigate([{outlets: {popups: message.payload}}], {
                        queryParamsHandling: 'merge',
                        relativeTo: this.route
                    });
                });
            });

        this.listeners.push(listenerId);
    }

    private setupDeactivatePopupListener() {
        let listenerId = this.messageBus.listen([MessageNames.MapDeactivatePopup],
            (observable: Observable<SimpleMessage>) => {
                return observable.subscribe(() => {
                    this.router.navigate([{outlets: {popups: null}}], {
                        queryParamsHandling: 'merge',
                        relativeTo: this.route
                    });
                });
            });

        this.listeners.push(listenerId);
    }

    private setupMapObjectAddedListener() {
        let listenerId = this.messageBus.listen([MessageNames.DomainPlaceAdded, MessageNames.DomainAreaAdded],
            (observable: Observable<Message<MapObject>>) => {
                return observable.subscribe(message => this.mapProvider.draw(message.payload));
            });

        this.listeners.push(listenerId);
    }

    private setupCenterChangedListener() {
        let listenerId = this.messageBus.listen([MessageNames.DomainCenterChanged],
            (observable: Observable<Message<CenterChangedEventArgs>>) => {
                return observable
                    .pipe(
                        filter(x => !x.payload.setFromMap)
                    )
                    .subscribe(message => {
                        this.mapProvider.panToCoords(message.payload.center);
                    });
            });
        this.listeners.push(listenerId);
    }

    private setupZoomChangedListener() {
        let listenerId = this.messageBus.listen([MessageNames.DomainZoomChanged],
            (observable: Observable<Message<ZoomChangedEventArgs>>) => {
                return observable
                    .pipe(
                        filter(x => !x.payload.setFromMap)
                    )
                    .subscribe(message => {
                        this.mapProvider.setZoom(message.payload.zoom);
                    });
            });
        this.listeners.push(listenerId);
    }

    private setupMapObjectDeletedListener() {
        let listenerId = this.messageBus.listen([MessageNames.DomainObjectDeleted],
            (observable: Observable<Message<MapObject>>) => {
                return observable
                    .subscribe(message => {

                        this.mapProvider.deleteObject(message.payload.uuid);

                    });
            });
        this.listeners.push(listenerId);
    }

    private setupMapProvider(map:any, initialState: any){

        this.mapProvider.idle.subscribe(newState => {
            this.mapStore.entity.updateCenterFromMap(newState.center);
            this.mapStore.entity.updateZoomFromMap(newState.zoom);

            this.updateQueryString(newState.zoom, newState.center);
        });

        this.mapProvider.phantomPlaceCoordsChanged.subscribe(value => {
            let message = new Message(MessageNames.MapPhantomPlaceCoordsChanged, value, this);
            this.messageBus.publish(message);
        });

        this.mapProvider.phantomAreaPathChanged.subscribe(newValue => {
            let message = new Message(MessageNames.MapPhantomAreaPathChanged, newValue, this);
            this.messageBus.publish(message);
        });

        this.mapProvider.ready.subscribe(()=> {
            let message = new SimpleMessage(MessageNames.MapReady);
            this.messageBus.publish(message);
        });

        this.mapProvider.setup(map, initialState);
    }
}
