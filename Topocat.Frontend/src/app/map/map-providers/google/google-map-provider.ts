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
import { PhantomPlaceCoordsChangedEventArgs } from '../../models/phantom-place-coords-changed-event-args';
import { PhantomAreaPathChangedEventArgs } from '../../models/phantom-area-path-changed-event-args';

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

    drawArea(area: Area): void {
        this.assertMapReady();

        let drawnObject = this.areaToGoogleMapDrawnObjectMapping(area);
        this.drawnObjects.push(drawnObject);
    }

    ngOnDestroy(): void {
        this.messageBus.stopListen(this.listeners);
        this.listeners.splice(0, this.listeners.length);
        this.unregister();
    }

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
            let mapObject = this.drawnObjects[key].object;

            if (mapObject instanceof google.maps.Marker) {
                (<google.maps.Marker>mapObject).setMap(setMapArg);
            }

            if (mapObject instanceof google.maps.Polygon) {
                (<google.maps.Polygon>mapObject).setMap(setMapArg);
            }

            if (!visible && this.drawnObjects[key].infoWindow) {
                this.drawnObjects[key].infoWindow.close();
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
            let area = <Area>mapObject;
            if (this.phantoms.find(x => x.uuid === area.uuid)) {
                this.updatePhantomArea(area)
            } else {
                this.phantoms.push(this.addPhantomArea(area));
            }
        }
    }

    removePhantom(mapObject: MapObject) {
        this.assertMapReady();

        let phantom = this.phantoms.find(x => x.uuid === mapObject.uuid);

        if (!phantom) {
            throw new Error('Phantom not found');
        }

        let phantomIndex = this.phantoms.indexOf(phantom);
        this.phantoms.splice(phantomIndex, 1);

        if (phantom.object instanceof google.maps.Marker) {
            (<google.maps.Marker>phantom.object).setMap(null);
        }

        if (phantom.object instanceof google.maps.Polygon) {
            (<google.maps.Polygon>phantom.object).setMap(null);
        }
    }

    centerTo(object: MapObject): void {
        if (object instanceof Place) {
            let center = (<Place>object).coords;
            this.map.panTo(center);
        }

        if (object instanceof Area) {
            let areaObject = <Area>object;

            let bounds = new google.maps.LatLngBounds();
            for (let i = 0; i < areaObject.path.length; i++) {
                bounds.extend(areaObject.path[i]);
            }

            this.map.panTo(bounds.getCenter());
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
        this.initAreaAddedListener();
        this.initCenterChangedListener();
        this.initZoomChangedListener();
        this.initObjectDeletedListener();
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

    private initAreaAddedListener() {
        let listenerId = this.messageBus.listen([MessageNames.DomainAreaAdded],
            (observable: Observable<Message<Area>>) => {
                return observable.subscribe(message => this.drawArea(message.payload));
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

    private initObjectDeletedListener() {
        let listenerId = this.messageBus.listen([MessageNames.DomainObjectDeleted],
            (observable: Observable<Message<MapObject>>) => {
                return observable
                    .subscribe(message => {
                        this.assertMapReady();
                        let index = this.drawnObjects.findIndex(x => x.uuid === message.payload.uuid);

                        if (index == -1) {
                            throw new Error('Object not found');
                        }

                        if (this.drawnObjects[index].object instanceof google.maps.Marker) {
                            (<google.maps.Marker>this.drawnObjects[index].object).setMap(null);
                        }

                        if (this.drawnObjects[index].object instanceof google.maps.Polygon) {
                            (<google.maps.Polygon>this.drawnObjects[index].object).setMap(null);
                        }

                        this.drawnObjects.splice(index, 1);
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
            return function (event: google.maps.MouseEvent) {
                let payload = new PhantomPlaceCoordsChangedEventArgs(drawnObject.uuid, event.latLng.lat(), event.latLng.lng());
                let message = new Message(MessageNames.MapPhantomPlaceCoordsChanged, payload, provider);
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
            position: place.coords
        });
    }

    private addPhantomArea(area: Area): GoogleMapDrawnObject {
        this.assertMapReady();

        if (this.phantoms.some(x => x.uuid === area.uuid)) {
            throw new Error('There is a phantom with same uuid.')
        }

        let drawnObject = this.areaToGoogleMapDrawnObjectMapping(area, true);

        let polygon = <google.maps.Polygon>drawnObject.object;

        polygon.addListener('dragend', this.onPolygonDrag(this, drawnObject));
        polygon.addListener('updated', this.onPolygonDrag(this, drawnObject));
        this.setPolygonPathListeners(drawnObject);

        return drawnObject;
    }

    private updatePhantomArea(area: Area) {
        let drawnPhantom: GoogleMapDrawnObject = this.phantoms.find(x => x.uuid === area.uuid);

        if (!drawnPhantom) {
            throw new Error('Phantom not found');
        }

        if (drawnPhantom.infoWindow) {
            drawnPhantom.infoWindow.setContent(`${area.title}: ${area.description}`);
        }

       let newPathValue = area.path.map(coord => {
            return {lat: coord.lat, lng: coord.lng}
        });

        let polygon = (<google.maps.Polygon>drawnPhantom.object);

        polygon.getPath().unbindAll();

        polygon.setPath(newPathValue);
        this.setPolygonPathListeners(drawnPhantom);

        polygon.notify('updated');
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
    };


    private areaToGoogleMapDrawnObjectMapping = (area: Area, isPhantom = false): GoogleMapDrawnObject => {
        let infoWindow = new google.maps.InfoWindow({
            content: `${area.title}: ${area.description}`
        });

        let pathValue = area.path.map(coord => {
            return {lat: coord.lat, lng: coord.lng}
        });

        let polygon = new google.maps.Polygon({
            fillOpacity: isPhantom ? 0.2 : 0.5,
            strokeOpacity: isPhantom ? 0.4 : 1,
            paths: [pathValue],
            editable: isPhantom,
            draggable: isPhantom,
            clickable: true,
            map: this.map
        });

        polygon.addListener('click', function () {
            infoWindow.open(polygon.getMap(), polygon);
        });

        return new GoogleMapDrawnObject(area.uuid, polygon, infoWindow);
    };

    private onPolygonDrag = function (provider: GoogleMapProvider, drawnObject: GoogleMapDrawnObject) {
        return function () {
            let polygon = <google.maps.Polygon>drawnObject.object;
            let path = polygon.getPath().getArray().map(latLng => {
                return {lat: latLng.lat(), lng: latLng.lng()}
            });

            let payload = new PhantomAreaPathChangedEventArgs(drawnObject.uuid, path);
            let message = new Message(MessageNames.MapPhantomAreaCoordsChanged, payload, provider);
            provider.messageBus.publish(message);
        };
    };

    private setPolygonPathListeners(polygonPhantom: GoogleMapDrawnObject) {
        let path = (<google.maps.Polygon>polygonPhantom.object).getPath();

        path.addListener('update', this.onPolygonDrag(this, polygonPhantom));
        path.addListener('insert_at', this.onPolygonDrag(this, polygonPhantom));
        path.addListener('remove_at', this.onPolygonDrag(this, polygonPhantom));
        path.addListener('set_at', this.onPolygonDrag(this, polygonPhantom));
    }
}