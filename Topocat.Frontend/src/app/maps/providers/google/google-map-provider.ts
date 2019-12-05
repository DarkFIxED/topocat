import {MapProvider} from '../map-provider';
import {UnifiedMapObject} from '../unified-map-object';
import {BehaviorSubject, Subject} from 'rxjs';
import {Coordinates} from '../../../core/models/coordinates';
import {distinctUntilChanged} from 'rxjs/operators';
import {google} from 'google-maps';
import {NgZone} from '@angular/core';
import {MapObjectModel} from '../../models/map-object.model';
import {WktPrimitives} from '../../models/wkt-primitives';
import {SupportedMapTypes} from '../supported-map-types';
import {GoogleUnifiedMapObjectsFactory} from './google-unified-map-objects-factory.service';
import {WktService} from '../../services/wkt.service';

export class GoogleMapProvider extends MapProvider {

    private readonly defaultZoomLevel = 12;

    private position: BehaviorSubject<Coordinates>;
    private zoom: BehaviorSubject<number>;
    private infoWindowClosed = new Subject();
    private openDetailsRequired = new Subject<string>();
    private tagSearchRequired = new Subject<string>();

    private infoWindow: google.maps.InfoWindow;
    private drawingManager: google.maps.drawing.DrawingManager;

    constructor(private mapInstance: google.maps.Map,
                private zone: NgZone,
                private wktService: WktService) {
        super();

        this.initialize();
    }

    getType(): SupportedMapTypes {
        return SupportedMapTypes.Google;
    }

    getAvailableMapModes(): { title: string; value: string }[] {
        return [
            {title: 'Roadmap', value: 'roadmap'},
            {title: 'Hybrid', value: 'hybrid'},
            {title: 'Satellite', value: 'satellite'},
            {title: 'Terrain', value: 'terrain'}
        ];
    }

    getMapMode(): string {
        return this.mapInstance.getMapTypeId().toString();
    }

    setMapMode(mode: string) {
        this.mapInstance.setMapTypeId(mode);
    }

    panTo(coords: Coordinates, zoom: number) {
        this.mapInstance.panTo({lat: coords.lat, lng: coords.lng});

        if (this.mapInstance.getZoom() !== zoom) {
            this.mapInstance.setZoom(zoom);
        }
    }

    openInfoWindow(mapObject: MapObjectModel, unifiedMapObject: UnifiedMapObject) {
        if (mapObject.id !== unifiedMapObject.id) {
            throw new Error();
        }

        const self = this;
        // @ts-ignore
        window.onDetailsClick = function() {
            self.zone.run(() => {
                self.openDetailsRequired.next(mapObject.id.toString());
            });
        };

        // @ts-ignore
        window.onTagSearchClick = function(tag: string) {
            self.zone.run(() => {
                self.tagSearchRequired.next(tag);
            });
        };

        const description = !mapObject.description
            ? ''
            : mapObject.description;

        let content =
            `<div class="info-window-content">` +
            `<span class="text-overflow d-inline-block info-window-row font-weight-bold" title="${mapObject.title}">${mapObject.title}</span><br>`;

        if (!!description) {
            content += `<span class="text-overflow d-inline-block info-window-row" title="${mapObject.description}">${mapObject.description}</span><br>`;
        }

        if (!!mapObject.tags.length) {
            let tagsString = mapObject.tags.map(tag => `<div class="tag-chip" onClick="window.onTagSearchClick('${tag}')">#${tag}</div>`).join('&nbsp;');
            tagsString = `<div class="d-flex flex-wrap info-window-row">${tagsString}</div>`;

            content += tagsString;
        }

        content += `<div class="d-flex mt-1">` +
            `<button class="ml-auto float-right info-window-open-properties-button mdi mdi-map-marker-question-outline" ` +
            `title="Details..." ` +
            `onClick="window.onDetailsClick()">Details...</button>` +
            `</div>` +
            `</div>`;

        this.infoWindow.setContent(content);
        this.infoWindow.setPosition(unifiedMapObject.getInfoWindowPosition());
        this.infoWindow.open(this.mapInstance);
    }

    closeInfoWindow() {
        this.infoWindow.setContent(null);
        this.infoWindow.close();
    }

    drawFigure(type: string): Promise<Coordinates | Coordinates[] | Coordinates[][]> {
        return new Promise<Coordinates | Coordinates[] | Coordinates[][]>((resolve => {
            switch (type) {
                case WktPrimitives.Point:
                    this.drawPoint(this.drawingManager, resolve);
                    break;

                case WktPrimitives.LineString:
                    this.drawLineString(this.drawingManager, resolve);
                    break;

                case WktPrimitives.Polygon:
                    this.drawPolygon(this.drawingManager, resolve);
                    break;

                default:
                    throw new Error();
            }
        }));
    }

    private initialize() {
        this.infoWindowClosed$ = this.infoWindowClosed.asObservable();
        this.openDetailsRequired$ = this.openDetailsRequired.asObservable();
        this.tagSearchRequired$ = this.tagSearchRequired.asObservable();

        this.unifiedObjectsFactory = new GoogleUnifiedMapObjectsFactory(this.wktService, this.mapInstance);

        this.setUpMapObservables();
        this.setUpInfoWindow();
        this.setUpDrawingManager();
    }

    private drawPoint(drawingManager: google.maps.drawing.DrawingManager, resolveFunc: (result?: any) => void) {
        drawingManager.setOptions({
            drawingControl: false,
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            map: this.mapInstance
        });

        const listener = drawingManager.addListener('markercomplete', (marker: google.maps.Marker) => {
            listener.remove();
            drawingManager.setMap(null);
            marker.setMap(null);

            const position = marker.getPosition();
            const coordinates = new Coordinates(position.lat(), position.lng());

            resolveFunc(coordinates);
        });
    }

    private drawLineString(drawingManager: google.maps.drawing.DrawingManager, resolveFunc: (result?: any) => void) {
        drawingManager.setOptions({
            drawingControl: false,
            drawingMode: google.maps.drawing.OverlayType.POLYLINE,
            map: this.mapInstance
        });

        const listener = drawingManager.addListener('polylinecomplete', (polyline: google.maps.Polyline) => {
            listener.remove();
            drawingManager.setMap(null);
            polyline.setMap(null);

            const path = polyline.getPath().getArray().map(latLng => new Coordinates(latLng.lat(), latLng.lng()));
            resolveFunc(path);
        });
    }

    private drawPolygon(drawingManager: google.maps.drawing.DrawingManager, resolveFunc: (result?: any) => void) {
        drawingManager.setOptions({
            drawingControl: false,
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            map: this.mapInstance
        });

        const listener = drawingManager.addListener('polygoncomplete', (polygon: google.maps.Polygon) => {
            listener.remove();
            drawingManager.setMap(null);
            polygon.setMap(null);

            const paths = polygon.getPaths().getArray().map(path => path.getArray().map(latLng => new Coordinates(latLng.lat(), latLng.lng())));
            resolveFunc(paths);
        });
    }

    private setUpMapObservables() {
        const initialMapCenter = this.mapInstance.getCenter();
        const initialZoom = this.mapInstance.getZoom();
        this.position = new BehaviorSubject<Coordinates>({lat: initialMapCenter.lat(), lng: initialMapCenter.lng()});
        this.zoom = new BehaviorSubject<number>(initialZoom);

        this.position$ = this.position.asObservable().pipe(
            distinctUntilChanged()
        );
        this.zoom$ = this.zoom.asObservable().pipe(
            distinctUntilChanged()
        );

        this.mapInstance.addListener('idle', () => {
            const newZoom = this.mapInstance.getZoom();
            const newMapCenter = this.mapInstance.getCenter();

            this.position.next({lat: newMapCenter.lat(), lng: newMapCenter.lng()});
            this.zoom.next(newZoom);
        });
    }

    private setUpInfoWindow() {
        this.infoWindow = new google.maps.InfoWindow();
        this.infoWindow.addListener('closeclick', () => {
            // @ts-ignore
            window.onDetailsClick = undefined;

            this.infoWindowClosed.next();
        });
    }

    private setUpDrawingManager() {
        this.drawingManager = new google.maps.drawing.DrawingManager({
            map: null,
            drawingControl: false,
        });
    }

    getDefaultZoomLevel(): number {
        return this.defaultZoomLevel;
    }
}
