import {BaseUnifiedMapObject} from '../base-unified-map-object';
import {ID} from '@datorama/akita';

export abstract class YandexUnifiedMapObject extends BaseUnifiedMapObject<any> {

    protected isEnabled = true;

    protected constructor(id: ID, mapInstance: any, opts?: any) {
        super(id, mapInstance, opts);

        this.underlyingObject.events.add('click', () => {
            if (this.isEnabled)
                this.click.next(this.id);
        });
    }
}
