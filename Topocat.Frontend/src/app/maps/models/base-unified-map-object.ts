import {UnifiedMapObject} from './unified-map-object';
import {Subject} from 'rxjs';
import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';
import {Coordinates} from '../../core/models/coordinates';
import {WktPrimitives} from './wkt-primitives';

export abstract class BaseUnifiedMapObject<T extends google.maps.MVCObject> implements UnifiedMapObject {

    protected click = new Subject<ID>();
    click$ = this.click.asObservable();

    protected drag = new Subject<Coordinates | Coordinates[] | Coordinates[][]>();
    drag$ = this.drag.asObservable();

    id: ID;

    protected underlyingObject: T;

    protected constructor(id: ID, opts?: any) {
        this.id = id;
        this.underlyingObject = this.createInstance(opts);
        this.underlyingObject.addListener('click', () => this.click.next(this.id));
    }

    abstract dispose();

    abstract getType(): string;

    abstract update(object: MapObjectModel, newCoords: Coordinates | Coordinates[] | Coordinates[][]);

    abstract getInfoWindowPosition(): { lat: number; lng: number };

    protected abstract createInstance(opts?: any): T;

    abstract disable();

    abstract enable();

    abstract allowChange();

    abstract disallowChange();

}
