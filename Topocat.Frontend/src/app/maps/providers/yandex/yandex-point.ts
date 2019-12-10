/* tslint:disable:no-string-literal */
import {UnifiedMapObject} from '../unified-map-object';
import {YandexUnifiedMapObject} from './yandex-unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from '../../models/map-object.model';
import {Coordinates} from '../../../core/models/coordinates';
import {WktPrimitives} from '../../models/wkt-primitives';

export class YandexPoint extends YandexUnifiedMapObject implements UnifiedMapObject {

    private readonly disabledColor = '#AAAAAA22';
    private readonly enabledColor = '#1E98FFFF';

    constructor(id: ID, mapInstance: any, opts?: any) {
        super(id, mapInstance, opts);

        this.underlyingObject.events.add('dragend', () => {
            const position = this.underlyingObject.geometry.getCoordinates();
            const coordinates = new Coordinates(position[0], position[1]);
            this.drag.next(coordinates);
        });
    }

    protected createInstance(opts?: any): any {
        return new window['ymaps'].Placemark([opts.lat, opts.lng], {
            iconCaption: opts.title,
        }, {
            draggable: false,
            iconColor: this.enabledColor
        });
    }

    enable() {
        this.isEnabled = true;
        this.underlyingObject.options.set('cursor', 'pointer');
        this.underlyingObject.options.set('iconColor', this.enabledColor);
    }

    disable() {
        this.isEnabled = false;
        this.underlyingObject.options.set('cursor', 'default');
        this.underlyingObject.options.set('iconColor', this.disabledColor);
    }

    allowChange() {
        this.underlyingObject.options.set('draggable', true);
    }

    disallowChange() {
        this.underlyingObject.options.set('draggable', false);
    }

    dispose() {
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
        this.underlyingObject.options.lat = newCoords.lat;
        this.underlyingObject.options.lng = newCoords.lng;
        this.underlyingObject.properties.iconCaption = object.title;
    }

    getUnderlyingObject(): any {
        return this.underlyingObject;
    }
}
