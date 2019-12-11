/* tslint:disable:no-string-literal */
import {BaseUnifiedMapObject} from '../base-unified-map-object';
import {ID} from '@datorama/akita';
import {Coordinates} from '../../../core/models/coordinates';
import {WktPrimitives} from '../../models/wkt-primitives';

export abstract class YandexUnifiedMapObject extends BaseUnifiedMapObject<any> {

    protected isEnabled = true;

    protected constructor(id: ID, mapInstance: any, opts?: any) {
        super(id, mapInstance, opts);

        this.underlyingObject.events.add('click', () => {
            if (this.isEnabled) {
                this.click.next(this.id);
            }
        });

        this.underlyingObject.geometry.events.add('change', event => this.handlePathChanged(event));
    }

    getUnderlyingObject(): any {
        return this.underlyingObject;
    }

    getInfoWindowPosition(): { lat: number; lng: number } {
        const coords = this.underlyingObject.geometry.getCoordinates();
        if (this.getType() === WktPrimitives.Point) {
            return {
                lat: coords[0],
                lng: coords[1]
            };
        }

        const bounds = window['ymaps'].util.bounds.fromPoints(coords);
        const center = window['ymaps'].util.bounds.getCenter(bounds);
        return {
            lat: center[0],
            lng: center[1]
        };
    }

    dispose() {
    }

    protected abstract handlePathChanged(event: any);
}
