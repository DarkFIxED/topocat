/* tslint:disable:no-string-literal */
import {YandexUnifiedMapObject} from './yandex-unified-map-object';
import {UnifiedMapObject} from '../unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from '../../models/map-object.model';
import {Coordinates} from '../../../core/models/coordinates';
import {WktPrimitives} from '../../models/wkt-primitives';

export class YandexPolygon extends YandexUnifiedMapObject implements UnifiedMapObject {

    static readonly disabledFillColor = '#00000033';
    static readonly disabledStrokeColor = '#00000033';
    static readonly enabledFillColor = '#00000059';
    static readonly enabledStrokeColor = '#000000CC';

    constructor(id: ID, mapInstance: any, opts?: any) {
        super(id, mapInstance, opts);
    }

    protected createInstance(opts?: any): any {
        return new window['ymaps'].Polygon(opts.paths, {}, {
            fillColor: YandexPolygon.enabledFillColor,
            strokeColor: YandexPolygon.enabledStrokeColor,
            strokeWidth: 2
        });
    }

    enable() {
        this.isEnabled = true;
        this.underlyingObject.options.set('cursor', 'pointer');
        this.underlyingObject.options.set('strokeColor', YandexPolygon.enabledStrokeColor);
        this.underlyingObject.options.set('fillColor', YandexPolygon.enabledFillColor);
    }

    disable() {
        this.isEnabled = false;
        this.underlyingObject.options.set('cursor', 'default');
        this.underlyingObject.options.set('strokeColor', YandexPolygon.disabledStrokeColor);
        this.underlyingObject.options.set('fillColor', YandexPolygon.disabledFillColor);
    }

    allowChange() {
        this.underlyingObject.editor.startEditing();
    }

    disallowChange() {
        this.underlyingObject.editor.stopEditing();
    }

    getType(): string {
        return WktPrimitives.Polygon;
    }

    update(object: MapObjectModel, newCoords: Coordinates[][]) {
        const paths = newCoords.map(path => path.map(point => [point.lat, point.lng]));
        const geometry = this.underlyingObject.geometry;
        geometry.setCoordinates(paths);
    }

    getInfoWindowPosition(): { lat: number; lng: number } {
        const coords = this.underlyingObject.geometry.getCoordinates() as number[][];
        const aggregatedPath = [];
        coords.forEach(path => path.forEach(pathPoint => aggregatedPath.push(pathPoint)));
        const bounds = window['ymaps'].util.bounds.fromPoints(aggregatedPath);
        const center = window['ymaps'].util.bounds.getCenter(bounds);
        return {
            lat: center[0],
            lng: center[1]
        };
    }

    protected handlePathChanged(event: any) {
        const newCoordinates = event.get('newCoordinates') as number[][][];
        const paths = newCoordinates.map(path => path.map(coords => new Coordinates(coords[0], coords[1])));
        this.drag.next(paths);
    }
}
