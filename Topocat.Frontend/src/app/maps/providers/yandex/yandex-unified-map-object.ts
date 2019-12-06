import {BaseUnifiedMapObject} from '../base-unified-map-object';
import {ID} from '@datorama/akita';

export abstract class YandexUnifiedMapObject extends BaseUnifiedMapObject<any> {
    protected constructor(id: ID, opts?: any) {
        super(id, opts);

        this.underlyingObject.events.add('click', () => {
            this.click.next(this.id);
        });
    }
}
