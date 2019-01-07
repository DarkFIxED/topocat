import { Injectable, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Message, MessageBusService, SimpleMessage } from 'litebus';

import { Place } from '../../../domain/map/place';
import { Coords } from '../../../domain/map/coords';
import { MessageNames } from '../../../infrastructure/message-names';
import { CenterChangedEventArgs } from '../../../domain/map/event-args/center-changed.event-args';
import { ZoomChangedEventArgs } from '../../../domain/map/event-args/zoom-changed.event-args';
import { MapProvider } from '../map-provider';
import { MapService } from '../../services/map.service';
import { MapObject } from '../../../domain/map/map-object';
import { Area } from '../../../domain/map/area';
import { GoogleMapDrawnObject } from './google-map-drawn-object';
import { MapObjectCoordsChangedEventArgs } from '../../models/map-object-coords-changed-event-args';

@Injectable()
export class GoogleMapProvider implements OnDestroy, MapProvider {

    private readonly MaxGoogleZoom = 23;

    private drawingManager: google.maps.drawing.DrawingManager;
    private drawnObjects: Array<GoogleMapDrawnObject> = [];
    private phantoms: Array<GoogleMapDrawnObject> = [];

    private listeners = [];

    constructor(public messageBus: MessageBusService,
                public mapService: MapService) {
        this.register();
    }

    protected _map: google.maps.Map;


    public get map(): google.maps.Map {
        return this._map;
    }

    protected _mapReady: boolean = false;

    public get mapReady(): boolean {
        return this._mapReady;
    }

    public get maxZoom(): number {
        return this.MaxGoogleZoom;
    }

    setup(map: any, initialState: { zoom: number, center: Coords }): void {
        this._map = map;
        this._map.setZoom(initialState.zoom);
        this._map.setCenter(initialState.center);

        this.initDrawingManager();
        this.initMapHandlers();
        this.initListeners();

        this._mapReady = true;

        this.notifyThatMapReady();
    }

    drawPlace(place: Place): void {
        this.assertMapReady();

        let drawnObject = this.placeToGoogleMapDrawnObjectMapping(place);
        this.drawnObjects.push(drawnObject);
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

    setDrawnObjectsVisibility(visible: boolean) {
        this.assertMapReady();

        let setMapArg = visible ? this.map : null;

        for (let key in this.drawnObjects) {
            let mapObject = this.drawnObjects[key];

            if (mapObject instanceof google.maps.Marker) {
                (<google.maps.Marker>mapObject).setMap(setMapArg);
            }

            if (mapObject instanceof google.maps.Polygon) {
                (<google.maps.Polygon>mapObject).setMap(setMapArg);
            }
        }
    }

    addOrUpdatePhantom(mapObject: MapObject) {
        this.assertMapReady();

        if (mapObject instanceof Place) {
            let place = <Place>mapObject;
            if (this.phantoms.find(x => x.uuid === place.uuid)) {
                this.updatePhantomPlace(place)
            } else {
                this.phantoms.push(this.addPhantomPlace(place));
            }
        }

        if (mapObject instanceof Area) {
            this.phantoms.push(this.addPhantomArea(<Area>mapObject));
        }
    }

    removePhantom(mapObject: MapObject) {
        this.assertMapReady();

        let phantom = this.phantoms.find(x => x.uuid === mapObject.uuid);

        if (!phantom) {
            throw new Error('Phantom not found');
        }

        if (phantom.object instanceof google.maps.Marker) {
            (<google.maps.Marker>phantom.object).setMap(null);
        }

        if (phantom.object instanceof google.maps.Polygon) {
            (<google.maps.Polygon>phantom.object).setMap(null);
        }
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
        this.initIdleListener();
    }

    private initListeners() {
        this.initPlaceAddedListener();
        this.initCenterChangedListener();
        this.initZoomChangedListener();
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

    private initIdleListener() {
        let onIdle = function (provider: GoogleMapProvider) {
            return function () {
                let zoom = provider.map.getZoom();

                let mapCenter = provider.map.getCenter();
                let center = new Coords(mapCenter.lat(), mapCenter.lng());

                let message = new Message(MessageNames.MapIdle, {zoom: zoom, center: center}, provider);
                provider.messageBus.publish(message);
            }
        };

        this._map.addListener('idle', onIdle(this));
    }

    private initPlaceAddedListener() {
        let listenerId = this.messageBus.listen([MessageNames.DomainPlaceAdded],
            (observable: Observable<Message<Place>>) => {
                return observable.subscribe(message => this.drawPlace(message.payload));
            });

        this.listeners.push(listenerId);
    }

    private initCenterChangedListener() {
        let listenerId = this.messageBus.listen([MessageNames.DomainCenterChanged],
            (observable: Observable<Message<CenterChangedEventArgs>>) => {
                return observable
                    .pipe(
                        filter(x => !x.payload.setFromMap)
                    )
                    .subscribe(message => {
                        this.assertMapReady();
                        this.map.panTo(message.payload.center);
                    });
            });
        this.listeners.push(listenerId);
    }

    private initZoomChangedListener() {
        let listenerId = this.messageBus.listen([MessageNames.DomainZoomChanged],
            (observable: Observable<Message<ZoomChangedEventArgs>>) => {
                return observable
                    .pipe(
                        filter(x => !x.payload.setFromMap)
                    )
                    .subscribe(message => {
                        this.assertMapReady();
                        this.map.setZoom(message.payload.zoom);
                    });
            });
        this.listeners.push(listenerId);
    }

    private addPhantomPlace(place: Place): GoogleMapDrawnObject {
        this.assertMapReady();

        if (this.phantoms.some(x => x.uuid === place.uuid)) {
            throw new Error('There is a phantom with same uuid.')
        }

        let drawnObject = this.placeToGoogleMapDrawnObjectMapping(place, true);
        let onMarkerDrag = function (provider: GoogleMapProvider, drawnObject: GoogleMapDrawnObject) {
            return function (event: any) {
                let payload = new MapObjectCoordsChangedEventArgs(drawnObject.uuid, event.latLng.lat(), event.latLng.lng());
                let message = new Message(MessageNames.MapPhantomCoordsChanged, payload, provider);
                provider.messageBus.publish(message);
            };
        };
        (<google.maps.Marker>drawnObject.object).addListener('drag', onMarkerDrag(this, drawnObject));

        return drawnObject;
    }

    private updatePhantomPlace(place: Place) {
        let drawnPhantom: GoogleMapDrawnObject = this.phantoms.find(x => x.uuid === place.uuid);

        if (!drawnPhantom) {
            throw new Error('Phantom not found');
        }

        if (drawnPhantom.infoWindow) {
            drawnPhantom.infoWindow.setContent(place.description);
        }

        (<google.maps.Marker>drawnPhantom.object).setOptions({
            label: place.title,
            opacity: 0.4,
            position: place.coords,
            draggable: true,
            map: this.map
        });

    }

    private addPhantomArea(area: Area): GoogleMapDrawnObject {
        throw new Error('Not implemented yet.');
    }

    private placeToGoogleMapDrawnObjectMapping = (place: Place, isPhantom = false): GoogleMapDrawnObject => {
        let infoWindow = new google.maps.InfoWindow({
            content: place.description
        });

        let marker = new google.maps.Marker({
            label: place.title,
            opacity: isPhantom ? 0.4 : 1,
            position: place.coords,
            draggable: isPhantom,
            map: this.map
        });

        marker.addListener('click', function () {
            infoWindow.open(marker.getMap(), marker);
        });

        return new GoogleMapDrawnObject(place.uuid, marker, infoWindow);
    }
}