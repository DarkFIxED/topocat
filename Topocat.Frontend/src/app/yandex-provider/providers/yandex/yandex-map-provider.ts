import {MapProvider} from '../../../maps/providers/map-provider';
import {SupportedMapTypes} from '../../../maps/providers/supported-map-types';
import {MapObjectModel} from '../../../maps/models/map-object.model';
import {UnifiedMapObject} from '../../../maps/providers/unified-map-object';
import {Coordinates} from '../../../core/models/coordinates';
import {YandexUnifiedMapObjectsFactory} from './yandex-unified-map-objects-factory';
import {WktService} from '../../../maps/services/wkt.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {NgZone} from '@angular/core';
import {distinctUntilChanged} from 'rxjs/operators';
import {WktPrimitives} from '../../../maps/models/wkt-primitives';

export class YandexMapProvider extends MapProvider {

    private readonly defaultMapZoom = 8;

    private position: BehaviorSubject<Coordinates>;
    private zoom: BehaviorSubject<number>;
    private infoWindowClosed = new Subject();
    private openDetailsRequired = new Subject<string>();
    private tagSearchRequired = new Subject<string>();

    constructor(private mapInstance: any,
                private wktService: WktService,
                private zone: NgZone) {
        super();
        this.unifiedObjectsFactory = new YandexUnifiedMapObjectsFactory(this.mapInstance, this.wktService);

        this.openDetailsRequired$ = this.openDetailsRequired.asObservable();
        this.tagSearchRequired$ = this.tagSearchRequired.asObservable();
        this.infoWindowClosed$ = this.infoWindowClosed.asObservable();

        this.setUpMapObservables();
    }

    closeInfoWindow() {
        this.mapInstance.balloon.close();
    }

    drawFigure(type: string): Promise<Coordinates | Coordinates[] | Coordinates[][]> {
        return new Promise<Coordinates | Coordinates[] | Coordinates[][]>((resolve => {
            switch (type) {
                case WktPrimitives.Point:
                    this.drawPoint(resolve);
                    break;

                case WktPrimitives.LineString:
                    this.drawLineString(resolve);
                    break;

                case WktPrimitives.Polygon:
                    this.drawPolygon(resolve);
                    break;

                default:
                    throw new Error();
            }
        }));
    }

    getAvailableMapModes(): { title: string; value: string }[] {
        return [
            {value: 'yandex#map', title: 'Scheme'},
            {value: 'yandex#satellite', title: 'Satellite'},
            {value: 'yandex#hybrid', title: 'Hybrid'},
        ];
    }

    getDefaultZoomLevel(): number {
        return this.defaultMapZoom;
    }

    getMapMode(): string {
        return this.mapInstance.getType();
    }

    getType(): SupportedMapTypes {
        return SupportedMapTypes.Yandex;
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

        this.mapInstance.events.add('close', () => {
            this.infoWindowClosed.next();
        });

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

        const position = unifiedMapObject.getInfoWindowPosition();
        this.mapInstance.balloon.open([position.lat, position.lng],
            content,
            {
                // Опция: не показываем кнопку закрытия.
                closeButton: true
            });
    }

    panTo(coords: Coordinates, zoom: number) {
        this.mapInstance.panTo([coords.lat, coords.lng], zoom);
    }

    setMapMode(mode: string) {
        this.mapInstance.setType(mode);
    }

    removeObjectFromMap(unifiedMapObject: UnifiedMapObject) {
        this.mapInstance.geoObjects.remove(unifiedMapObject.getUnderlyingObject());
    }

    private setUpMapObservables() {
        const initialMapCenter = this.mapInstance.getCenter();
        const initialZoom = this.mapInstance.getZoom();
        this.position = new BehaviorSubject<Coordinates>({lat: initialMapCenter[0], lng: initialMapCenter[1]});
        this.zoom = new BehaviorSubject<number>(initialZoom);

        this.position$ = this.position.asObservable().pipe(
            distinctUntilChanged()
        );
        this.zoom$ = this.zoom.asObservable().pipe(
            distinctUntilChanged()
        );

        this.mapInstance.events.add('boundschange', event => {
            const center = event.get('newCenter');
            const zoom = event.get('newZoom');

            this.position.next({lat: center[0], lng: center[1]});
            this.zoom.next(zoom);
        });
    }

    private drawPoint(resolveFunc: (result?: any) => void) {
        const cursor = this.mapInstance.cursors.push('crosshair');
        this.mapInstance.events.add('click', e => {
            cursor.remove();

            const coords = e.get('coords');
            resolveFunc(new Coordinates(coords[0], coords[1]));
        });
    }

    private drawLineString(resolveFunc: (result?: any) => void) {
        const cursor = this.mapInstance.cursors.push('crosshair');
        this.mapInstance.events.add('click', e => {
            cursor.remove();

            const firstPointCoords = e.get('coords') as number[];

            // tslint:disable-next-line:no-string-literal
            const polyline = new window['ymaps'].Polyline([firstPointCoords], {}, {
                strokeWidth: 2,
            });
            this.mapInstance.geoObjects.add(polyline);

            polyline.editor.startEditing();
            polyline.editor.startDrawing();

            const self = this;
            polyline.editor.options.set({
                menuManager(editorItems, model) {
                    editorItems.push({
                        id: 'StopEditing',
                        title: 'Завершить редактирование',
                        onClick() {
                            polyline.editor.stopEditing();
                            polyline.editor.stopDrawing();
                            const polylineCoords = polyline.geometry.getCoordinates() as number[][];
                            self.mapInstance.geoObjects.remove(polyline);

                            const path = polylineCoords.map(point => new Coordinates(point[0], point[1]));
                            resolveFunc(path);
                        }
                    });
                    return editorItems;
                }
            });
        });
    }

    private drawPolygon(resolveFunc: (result?: any) => void) {
        const cursor = this.mapInstance.cursors.push('crosshair');
        this.mapInstance.events.add('click', e => {
            cursor.remove();

            const firstPointCoords = e.get('coords') as number[];

            // tslint:disable-next-line:no-string-literal
            const polygon = new window['ymaps'].Polygon([[firstPointCoords]], {}, {
                strokeWidth: 2,
            });
            this.mapInstance.geoObjects.add(polygon);

            polygon.editor.startEditing();
            polygon.editor.startDrawing();

            const self = this;
            polygon.editor.options.set({
                menuManager(editorItems, model) {
                    editorItems.push({
                        id: 'StopEditing',
                        title: 'Завершить редактирование',
                        onClick() {
                            polygon.editor.stopEditing();
                            polygon.editor.stopDrawing();
                            const polygonPaths = polygon.geometry.getCoordinates() as number[][][];
                            self.mapInstance.geoObjects.remove(polygon);

                            const paths = polygonPaths.map(path => path.map(point => new Coordinates(point[0], point[1])));
                            resolveFunc(paths);
                        }
                    });
                    return editorItems;
                }
            });
        });
    }
}
