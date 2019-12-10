import {UnifiedMapObject} from '../unified-map-object';
import {ID} from '@datorama/akita';
import {MapObjectModel} from '../../models/map-object.model';
import {google} from 'google-maps';
import {Coordinates} from '../../../core/models/coordinates';
import {WktPrimitives} from '../../models/wkt-primitives';
import {GoogleUnifiedMapObject} from './google-unified-map-object';

export class GooglePolygon extends GoogleUnifiedMapObject<google.maps.Polygon> implements UnifiedMapObject {

    constructor(id: ID, mapInstance: any, opts?: any) {
        super(id, mapInstance, opts);

        this.underlyingObject.getPaths().addListener('insert_at', () => this.handlePathsChanged());
        this.underlyingObject.getPaths().addListener('remove_at', () => this.handlePathsChanged());
        this.underlyingObject.getPaths().addListener('set_at', () => this.handlePathsChanged());

        this.underlyingObject.getPaths().getArray().forEach(path => {
            path.addListener('insert_at', () => this.handlePathsChanged());
            path.addListener('remove_at', () => this.handlePathsChanged());
            path.addListener('set_at', () => this.handlePathsChanged());
        });

        this.underlyingObject.addListener('dragend', () => this.handlePathsChanged());
    }

    dispose() {
        this.underlyingObject.unbindAll();
        this.underlyingObject.setMap(null);
    }

    getType(): string {
        return WktPrimitives.Polygon;
    }

    update(object: MapObjectModel, newCoords: Coordinates[][]) {
        this.underlyingObject.setOptions({
            paths: newCoords.map(path => path.map(coords => new google.maps.LatLng(coords.lat, coords.lng)))
        });
    }

    protected createInstance(opts?: any): google.maps.Polygon {
        return new google.maps.Polygon(opts);
    }

    getInfoWindowPosition(): { lat: number; lng: number } {
        const path = this.underlyingObject.getPath();
        const bounds = new google.maps.LatLngBounds(path[0], path[0]);
        path.forEach(latLng => bounds.extend(latLng));
        const center = bounds.getCenter();

        return {lat: center.lat(), lng: center.lng()};
    }

    disable() {
        this.underlyingObject.setOptions({
            strokeOpacity: 0.2,
            fillOpacity: 0.2,
            clickable: false
        });
    }

    enable() {
        this.underlyingObject.setOptions({
            strokeOpacity: 0.8,
            fillOpacity: 0.35,
            clickable: true
        });
    }

    allowChange() {
        this.underlyingObject.setOptions({
            editable: true,
            draggable: true
        });
    }

    disallowChange() {
        this.underlyingObject.setOptions({
            editable: false,
            draggable: false
        });
    }

    private handlePathsChanged() {
        const paths = this.underlyingObject.getPaths().getArray().map(path => path.getArray().map(latLng => new Coordinates(latLng.lat(), latLng.lng())));
        this.drag.next(paths);
    }

    getUnderlyingObject(): any {
        return this.underlyingObject;
    }
}
