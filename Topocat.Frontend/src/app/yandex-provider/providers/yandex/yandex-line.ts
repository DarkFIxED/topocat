/* tslint:disable:no-string-literal */
import {YandexUnifiedMapObject} from './yandex-unified-map-object';
import {UnifiedMapObject} from '../../../maps/providers/unified-map-object';
import {WktPrimitives} from '../../../maps/models/wkt-primitives';
import {MapObjectModel} from '../../../maps/models/map-object.model';
import {Coordinates} from '../../../core/models/coordinates';
import {ID} from '@datorama/akita';

export class YandexLine extends YandexUnifiedMapObject implements UnifiedMapObject {

    private static readonly enabledOpacity = 1;
    private static readonly disabledOpacity = 0.2;
    private static readonly strokeColor = '#000';

    constructor(id: ID, mapInstance: any, opts?: any) {
        super(id, mapInstance, opts);
    }

    protected createInstance(opts?: any): any {
        return new window['ymaps'].Polyline(opts.path, {}, {
            strokeColor: YandexLine.strokeColor,
            strokeWidth: 2,
            strokeOpacity: YandexLine.enabledOpacity
        });
    }

    enable() {
        this.isEnabled = true;
        this.underlyingObject.options.set('cursor', 'pointer');
        this.underlyingObject.options.set('strokeOpacity', YandexLine.enabledOpacity);
    }

    disable() {
        this.isEnabled = false;
        this.underlyingObject.options.set('cursor', 'default');
        this.underlyingObject.options.set('strokeOpacity', YandexLine.disabledOpacity);
    }

    allowChange() {
        this.underlyingObject.editor.startEditing();
    }

    disallowChange() {
        this.underlyingObject.editor.stopEditing();
    }

    update(object: MapObjectModel, newCoords: Coordinates[]) {
        const path = newCoords.map(point => [point.lat, point.lng]);
        const geometry = this.underlyingObject.geometry;
        geometry.setCoordinates(path);
    }

    getType(): string {
        return WktPrimitives.LineString;
    }

    getInfoWindowPosition(): { lat: number; lng: number } {
        const coords = this.underlyingObject.geometry.getCoordinates();
        const bounds = window['ymaps'].util.bounds.fromPoints(coords);
        const center = window['ymaps'].util.bounds.getCenter(bounds);
        return {
            lat: center[0],
            lng: center[1]
        };
    }

    protected handlePathChanged(event: any) {
        const newCoordinates = event.get('newCoordinates') as number[][];
        const path = newCoordinates.map(coords => new Coordinates(coords[0], coords[1]));
        this.drag.next(path);
    }
}
