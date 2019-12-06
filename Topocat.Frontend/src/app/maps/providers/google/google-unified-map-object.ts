import {ID} from '@datorama/akita';
import {BaseUnifiedMapObject} from '../base-unified-map-object';

export abstract class GoogleUnifiedMapObject<T extends google.maps.MVCObject> extends BaseUnifiedMapObject<T> {
    protected constructor(id: ID, opts?: any) {
        super(id, opts);
        this.underlyingObject.addListener('click', () => this.click.next(this.id));
    }
}
