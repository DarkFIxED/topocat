import { Injectable, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { MessageBusService } from '../../../infrastructure/message-bus/message-bus.service';
import { Place } from '../../../domain/map/place';
import { Message } from '../../../infrastructure/message-bus/message';
import { Coords } from '../../../domain/map/coords';
import { MessageNames } from '../../../infrastructure/message-bus/message-names';
import { CenterChangedEventArgs } from '../../../domain/map/event-args/center-changed.event-args';
import { ZoomChangedEventArgs } from '../../../domain/map/event-args/zoom-changed.event-args';
import { MapProvider } from '../map-provider';
import { MapService } from '../../services/map.service';
import { SimpleMessage } from '../../../infrastructure/message-bus/simple-message';

@Injectable()
export class GoogleMapProvider implements OnDestroy, MapProvider {

    private readonly MaxGoogleZoom = 23;

    private drawingManager: google.maps.drawing.DrawingManager;
    private drawnObjects = {};

    private listeners = [];

    constructor(public messageBus: MessageBusService,
                public mapService: MapService) {
        this.register();
    }

    protected _map: google.maps.Map;

    public get map(): google.maps.Map {
        return this._map;
    }

    public get maxZoom(): number {
        return this.MaxGoogleZoom;
    }

    setup(map: any): void {
        this._map = map;

        this.initDrawingManager();
        this.initMapHandlers();
        this.initListeners();

        this.notifyThatMapReady();
    }

    drawPlace(place: Place): void {
        this.assertMapReady();

        let marker = new google.maps.Marker();
        marker.setPosition({lat: place.coords.lat, lng: place.coords.lng});
        marker.setMap(this._map);

        this.drawnObjects[place.uuid] = marker;
    }

    ngOnDestroy(): void {
        this.messageBus.stopListen(this.listeners);
        this.listeners.splice(0, this.listeners.length);
        this.unregister();
    }


    // public drawMarker(point: Point, args: any): Promise<Point> {
    //     if (this.isDrawingNow) {
    //         this.cancel();
    //     } else {
    //         this.isDrawingNow = true;
    //     }
    //
    //     return new Promise<any>((resolve, reject) => {
    //         this.drawingManager.setMap(this.map);
    //         this.drawingManager.setOptions({markerOptions: args});
    //         this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
    //
    //         let onMarkerCompleteHandler = function (service: GoogleMapProvider) {
    //             return function (marker: google.maps.Marker) {
    //                 service.isDrawingNow = false;
    //
    //                 if (service.cancelDrawingShape) {
    //                     service.cancelDrawingShape = false;
    //                     marker.setMap(null);
    //
    //                     reject();
    //                 } else {
    //                     point.coord = new Coord(marker.getPosition().lat(), marker.getPosition().lng());
    //                     service.drawnObjects[point.id] = marker;
    //                     resolve(marker);
    //                 }
    //
    //                 service.drawingManager.setDrawingMode(null);
    //                 service.onMarkerCompleteListener.remove();
    //             }
    //         };
    //
    //         this.onMarkerCompleteListener = google.maps.event.addListener(this.drawingManager, 'markercomplete', onMarkerCompleteHandler(this));
    //     });
    //
    // }
    //
    // drawPolygon(area: Area, args: any): Promise<Area> {
    //     if (this.isDrawingNow) {
    //         this.cancel();
    //     } else {
    //         this.isDrawingNow = true;
    //     }
    //
    //     return new Promise<any>((resolve, reject) => {
    //         this.drawingManager.setMap(this.map);
    //         this.drawingManager.setOptions({polygonOptions: args});
    //         this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    //
    //         let onPolygonCompleteHandler = function (service: GoogleMapProvider) {
    //             return function (polygon: google.maps.Polygon) {
    //                 service.isDrawingNow = false;
    //
    //                 if (service.cancelDrawingShape) {
    //                     service.cancelDrawingShape = false;
    //                     polygon.setMap(null);
    //
    //                     reject();
    //                 } else {
    //                     //area.coords = polygon.getPath().getArray().map(latLng => new Coord(latLng.lat(), latLng.lng()));
    //                     // service.drawnObjects[area.id] = polygon;
    //                     resolve(polygon);
    //                 }
    //
    //                 service.drawingManager.setDrawingMode(null);
    //                 service.onPolygonCompleteListener.remove();
    //             }
    //         };
    //
    //         this.onPolygonCompleteListener = google.maps.event.addListener(this.drawingManager, 'polygoncomplete', onPolygonCompleteHandler(this));
    //     });
    // }
    //
    // updateMarker(marker: any): Promise<any> {
    //     return undefined;
    // }
    //
    // updatePolygon(polygon: any): Promise<any> {
    //     return undefined;
    // }

    //


    //
    // public cancel() {
    //     this.cancelDrawingShape = true;
    //     this.drawingManager.setDrawingMode(null);
    // }

    register() {
        this.mapService.register(this);
    }

    unregister() {
        this.mapService.unregister(this);
    }


    private assertMapReady() {
        if (!this._map) {
            throw new Error('Map is not ready');
        }
    }

    private initDrawingManager() {
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: false,
            drawingControlOptions: {
                drawingModes: [
                    google.maps.drawing.OverlayType.MARKER,
                    google.maps.drawing.OverlayType.POLYGON
                ]
            }
        });
    }

    private initMapHandlers() {
        this.initCenterChangedHandler();
        this.initZoomChangedHandler();
    }

    private initListeners() {
        this.listeners.push(
            this.messageBus.listen([MessageNames.DomainPlaceAdded],
                (observable: Observable<Message<Place>>) => {
                    return observable.subscribe(message => this.drawPlace(message.payload));
                })
        );

        this.listeners.push(
            this.messageBus.listen([MessageNames.DomainCenterChanged],
                (observable: Observable<Message<CenterChangedEventArgs>>) => {
                    return observable
                        .pipe(
                            filter(x => !x.payload.setFromMap)
                        )
                        .subscribe(message => {
                            this.assertMapReady();
                            this.map.setCenter({lat: message.payload.center.lat, lng: message.payload.center.lng});
                        });
                })
        );

        this.listeners.push(
            this.messageBus.listen([MessageNames.DomainZoomChanged],
                (observable: Observable<Message<ZoomChangedEventArgs>>) => {
                    return observable
                        .pipe(
                            filter(x => !x.payload.setFromMap)
                        )
                        .subscribe(message => {
                            this.assertMapReady();
                            this.map.setZoom(message.payload.zoom);
                        });
                })
        );
    }

    private initCenterChangedHandler() {
        let onCenterChanged = function (provider: GoogleMapProvider) {
            return function () {

                let center = provider.map.getCenter();
                let coords = new Coords(center.lat(), center.lng());

                let message = new Message(MessageNames.MapCenterChanged, coords, provider);
                provider.messageBus.publish(message);
            }
        };

        this._map.addListener('center_changed', onCenterChanged(this));
    }

    private initZoomChangedHandler() {
        let onZoomChanged = function (provider: GoogleMapProvider) {
            return function () {
                let zoom = provider.map.getZoom();

                let message = new Message(MessageNames.MapZoomChanged, zoom, provider);
                provider.messageBus.publish(message);
            }
        };

        this._map.addListener('zoom_changed', onZoomChanged(this));
    }

    private notifyThatMapReady() {
        let message = new SimpleMessage(MessageNames.MapReady);
        this.messageBus.publish(message);
    }
}