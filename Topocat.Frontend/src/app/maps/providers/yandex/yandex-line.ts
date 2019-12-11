/* tslint:disable:no-string-literal */
import {YandexUnifiedMapObject} from './yandex-unified-map-object';
import {UnifiedMapObject} from '../unified-map-object';
import {WktPrimitives} from '../../models/wkt-primitives';
import {MapObjectModel} from '../../models/map-object.model';
import {Coordinates} from '../../../core/models/coordinates';
import {ID} from '@datorama/akita';

export class YandexLine extends YandexUnifiedMapObject implements UnifiedMapObject {

    private readonly enabledOpacity = 1;
    private readonly disabledOpacity = 0.2;

    constructor(id: ID, mapInstance: any, opts?: any) {
        super(id, mapInstance, opts);

        this.underlyingObject.geometry.events.add('change', event => this.handlePathChanged(event));
    }

    protected createInstance(opts?: any): any {
        return new window['ymaps'].Polyline(opts.path, {}, {
            strokeColor: '#000000',
            strokeWidth: 2,
            strokeOpacity: this.enabledOpacity
        });
    }

    enable() {
        this.isEnabled = true;
        this.underlyingObject.options.set('cursor', 'pointer');
        this.underlyingObject.options.set('strokeOpacity', this.enabledOpacity);
    }

    disable() {
        this.isEnabled = false;
        this.underlyingObject.options.set('cursor', 'default');
        this.underlyingObject.options.set('strokeOpacity', this.disabledOpacity);
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

    dispose() {
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

    getType(): string {
        return WktPrimitives.LineString;
    }

    getUnderlyingObject(): any {
        return this.underlyingObject;
    }

    private handlePathChanged(event: any) {
        const newCoordinates = event.get('newCoordinates') as number[][];
        const path = newCoordinates.map(coords => new Coordinates(coords[0], coords[1]));
        this.drag.next(path);
    }
}
