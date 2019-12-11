/* tslint:disable:no-string-literal */
import {UnifiedMapObject} from '../unified-map-object';
import {YandexUnifiedMapObject} from './yandex-unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from '../../models/map-object.model';
import {Coordinates} from '../../../core/models/coordinates';
import {WktPrimitives} from '../../models/wkt-primitives';

export class YandexPoint extends YandexUnifiedMapObject implements UnifiedMapObject {

    private static readonly disabledColor = '#AAAAAA22';
    private static readonly enabledColor = '#1E98FFFF';

    constructor(id: ID, mapInstance: any, opts?: any) {
        super(id, mapInstance, opts);

        // this.underlyingObject.events.add('dragend', () => {
        //     const position = this.underlyingObject.geometry.getCoordinates();
        //     const coordinates = new Coordinates(position[0], position[1]);
        //     this.drag.next(coordinates);
        // });
    }

    protected createInstance(opts?: any): any {
        return new window['ymaps'].Placemark([opts.lat, opts.lng], {
            iconCaption: opts.title,
        }, {
            draggable: false,
            iconColor: YandexPoint.enabledColor
        });
    }

    enable() {
        this.isEnabled = true;
        this.underlyingObject.options.set('cursor', 'pointer');
        this.underlyingObject.options.set('iconColor', YandexPoint.enabledColor);
    }

    disable() {
        this.isEnabled = false;
        this.underlyingObject.options.set('cursor', 'default');
        this.underlyingObject.options.set('iconColor', YandexPoint.disabledColor);
    }

    allowChange() {
        this.underlyingObject.options.set('draggable', true);
    }

    disallowChange() {
        this.underlyingObject.options.set('draggable', false);
    }

    getInfoWindowPosition(): { lat: number; lng: number } {
        const coords = this.underlyingObject.geometry.getCoordinates();

        return {
            lat: coords[0],
            lng: coords[1]
        };
    }

    getType(): string {
        return WktPrimitives.Point;
    }

    update(object: MapObjectModel, newCoords: Coordinates) {
        this.underlyingObject.options.set('lat', newCoords.lat);
        this.underlyingObject.options.set('lng', newCoords.lng);
        this.underlyingObject.properties.set('iconCaption', object.title);
    }

    protected handlePathChanged(event: any) {
        const newCoordinates = event.get('newCoordinates') as number[];
        this.drag.next(new Coordinates(newCoordinates[0], newCoordinates[1]));
    }
}
