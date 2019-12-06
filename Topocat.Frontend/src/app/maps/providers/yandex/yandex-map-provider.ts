import {MapProvider} from '../map-provider';
import {SupportedMapTypes} from '../supported-map-types';
import {MapObjectModel} from '../../models/map-object.model';
import {UnifiedMapObject} from '../unified-map-object';
import {Coordinates} from '../../../core/models/coordinates';
import {YandexUnifiedMapObjectsFactory} from './yandex-unified-map-objects-factory';
import {WktService} from '../../services/wkt.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {NgZone} from '@angular/core';

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

        this.setUpInfoWindow();
    }

    closeInfoWindow() {
        this.mapInstance.balloon.close();
    }

    drawFigure(type: string): Promise<Coordinates | Coordinates[] | Coordinates[][]> {
        return undefined;
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

        const underlyingObject = unifiedMapObject.getUnderlyingObject();

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

        const r = this.mapInstance.events.add('close', () => {
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

        this.mapInstance.balloon.open(underlyingObject.geometry.getCoordinates(),
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

    private setUpInfoWindow() {

    }
}
