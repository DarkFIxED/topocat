/* tslint:disable:no-string-literal */
import {UnifiedMapObject} from '../unified-map-object';
import {YandexUnifiedMapObject} from './yandex-unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from '../../models/map-object.model';
import {Coordinates} from '../../../core/models/coordinates';
import {WktPrimitives} from '../../models/wkt-primitives';

export class YandexPoint extends YandexUnifiedMapObject implements UnifiedMapObject {

    private readonly disabledColor = '#AAA';
    private readonly enabledColor = '#FFF';

    constructor(id: ID, opts?: any) {
        super(id, opts);
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
        this.underlyingObject.properties.iconColor = this.enabledColor;
    }

    disable() {
        this.underlyingObject.properties.iconColor = this.disabledColor;
    }

    allowChange() {
        this.underlyingObject.options.draggable = true;
    }

    disallowChange() {
        this.underlyingObject.options.draggable = false;
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
