import {UnifiedMapObject} from './unified-map-object';
import {Subject} from 'rxjs';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';

export abstract class BaseUnifiedMapObject<T extends google.maps.MVCObject> implements UnifiedMapObject {

    protected click = new Subject<ID>();
    click$ = this.click.asObservable();

    id: ID;

    protected underlyingObject: T;

    protected constructor(id: ID, opts?: any) {
        this.id = id;
        this.underlyingObject = this.createInstance(opts);
        this.underlyingObject.addListener('click', () => this.click.next(this.id));
    }

    abstract clear();

    abstract update(object: MapObjectModel);

    abstract getInfoWindowPosition(): { lat: number; lng: number };

    protected abstract createInstance(opts?: any): T;
}
