import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { Coords } from '../../../domain/map/coords';
import { MapProvider } from '../map-provider';
import { MapService } from '../../services/map.service';
import { MapObject } from '../../../domain/map/map-object';
import { GoogleMapDrawnObject } from './google-map-drawn-object';
import { PhantomPlaceCoordsChangedEventArgs } from '../../models/phantom-place-coords-changed-event-args';
import { PhantomAreaPathChangedEventArgs } from '../../models/phantom-area-path-changed-event-args';
import { GoogleObjectsHelper } from './google-objects-helper';

@Injectable()
export class GoogleMapProvider implements OnDestroy, MapProvider {

    protected _idle = new Subject<{ zoom: number, center: Coords }>();
    idle = this._idle.asObservable();

    protected _phantomPlaceCoordsChanged = new Subject<PhantomPlaceCoordsChangedEventArgs>();
    phantomPlaceCoordsChanged = this._phantomPlaceCoordsChanged.asObservable();

    protected _phantomAreaPathChanged = new Subject<PhantomAreaPathChangedEventArgs>();
    phantomAreaPathChanged = this._phantomAreaPathChanged.asObservable();

    protected _ready = new Subject<void>();
    ready = this._ready.asObservable();

    private readonly MaxGoogleZoom = 23;

    private drawingManager: google.maps.drawing.DrawingManager;
    private drawnObjects: Array<GoogleMapDrawnObject> = [];
    private phantoms: Array<GoogleMapDrawnObject> = [];

    private objectDrawer = new GoogleObjectsHelper();

    constructor(public mapService: MapService) {
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
        this.objectDrawer.setup(this._map);

        this._map.setZoom(initialState.zoom);
        this._map.setCenter(initialState.center);

        this.initDrawingManager();
        this.initMapHandlers();

        this._mapReady = true;

        this._ready.next();
    }

    draw(mapObject: MapObject): void {
        this.assertMapReady();

        let drawnObject = this.objectDrawer.draw(mapObject);
        this.drawnObjects.push(drawnObject);
    }

    drawMany(mapObjects: MapObject[]): void {
        this.assertMapReady();

        mapObjects.forEach(mapObject => {
            let drawnObject = this.objectDrawer.draw(mapObject);
            this.drawnObjects.push(drawnObject);
        });
    }

    ngOnDestroy(): void {
        this.unregister();
    }

    register() {
        this.mapService.register(this);
    }

    unregister() {
        this.mapService.unregister(this);
    }

    setDrawnObjectsVisibility(visibility: boolean) {
        this.assertMapReady();

        for (let key in this.drawnObjects) {
            if (visibility) {
                this.objectDrawer.show(this.drawnObjects[key]);
            } else {
                this.objectDrawer.hide(this.drawnObjects[key]);
            }
        }
    }

    setPhantomsVisibility(visibility: boolean) {
        this.assertMapReady();

        for (let key in this.drawnObjects) {
            if (visibility) {
                this.objectDrawer.show(this.phantoms[key]);
            } else {
                this.objectDrawer.hide(this.phantoms[key]);
            }
        }
    }

    addOrUpdatePhantom(mapObject: MapObject) {
        this.assertMapReady();

        let existingPhantom = this.phantoms.find(x => x.uuid === mapObject.uuid);
        if (existingPhantom) {
            this.objectDrawer.updatePhantom(existingPhantom, mapObject);
        } else {
            let phantom = this.objectDrawer.addPhantom(mapObject);

            phantom.coordsChanged.subscribe((payload: any) => {
                if (payload instanceof PhantomPlaceCoordsChangedEventArgs) {
                    this._phantomPlaceCoordsChanged.next(payload);
                }
                if (payload instanceof PhantomAreaPathChangedEventArgs) {
                    this._phantomAreaPathChanged.next(payload);
                }
            });

            this.phantoms.push(phantom);
        }
    }

    deletePhantom(uuid: string) {
        this.assertMapReady();

        let phantom = this.phantoms.find(x => x.uuid === uuid);

        if (!phantom) {
            throw new Error('Phantom not found');
        }

        let phantomIndex = this.phantoms.indexOf(phantom);
        this.phantoms.splice(phantomIndex, 1);

        this.objectDrawer.hide(phantom);
    }

    drawPath(): Promise<Coords[]> {
        return new Promise<Coords[]>((resolve) => {
            this.assertMapReady();

            this.drawingManager.setMap(this.map);
            this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);

            let onPolygonCompleteHandler = function (provider: GoogleMapProvider) {
                return function (polygon: google.maps.Polygon) {
                    provider.drawingManager.unbind('polygoncomplete');
                    provider.drawingManager.setMap(null);

                    let coords = polygon.getPath().getArray().map(latLng => new Coords(latLng.lat(), latLng.lng()));
                    polygon.setMap(null);

                    resolve(coords);
                };
            };

            google.maps.event.addListener(this.drawingManager, 'polygoncomplete', onPolygonCompleteHandler(this));
        });
    }

    drawCoords(): Promise<Coords> {
        return new Promise<any>((resolve, reject) => {
            this.assertMapReady();

            this.drawingManager.setMap(this.map);
            this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);

            let onMarkerCompleteHandler = function (provider: GoogleMapProvider) {
                return function (marker: google.maps.Marker) {
                    provider.drawingManager.unbind('markercomplete');
                    provider.drawingManager.setMap(null);

                    let coords = new Coords(marker.getPosition().lat(), marker.getPosition().lng());
                    marker.setMap(null);

                    resolve(coords);
                }
            };

            google.maps.event.addListener(this.drawingManager, 'markercomplete', onMarkerCompleteHandler(this));
        });
    }

    centerTo(object: MapObject): void {
        let center = this.objectDrawer.getCenter(object);
        this.map.panTo(center);
    }

    panToCoords(coords: Coords): void {
        this.assertMapReady();
        this.map.panTo(coords);
    }

    setZoom(zoom: number): void {
        this.assertMapReady();
        this.map.setZoom(zoom);
    }

    deleteObject(uuid: string) {
        this.assertMapReady();
        let index = this.drawnObjects.findIndex(x => x.uuid === uuid);

        if (index == -1) {
            throw new Error('Object not found');
        }

        this.objectDrawer.hide(this.drawnObjects[index]);

        this.drawnObjects.splice(index, 1);
    }

    deleteAll() {
        let drawnObjectsIds = this.drawnObjects.map(x => x.uuid);
        for (let id of drawnObjectsIds) {
            this.deleteObject(id);
        }

        let phantomsIds = this.phantoms.map(x => x.uuid);
        for (let id of phantomsIds) {
            this.deletePhantom(id);
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
        this.initIdleListener();
    }

    private initIdleListener() {
        let onIdle = function (provider: GoogleMapProvider) {
            return function () {
                let zoom = provider.map.getZoom();

                let mapCenter = provider.map.getCenter();
                let center = new Coords(mapCenter.lat(), mapCenter.lng());

                provider._idle.next({zoom: zoom, center: center});
            }
        };

        this._map.addListener('idle', onIdle(this));
    }
}