import { AggregationRoot } from './aggregation-root';
import { Subject } from 'rxjs';

export abstract class Store<T extends AggregationRoot> {

    protected entityChangedSubject: Subject<T> = new Subject<T>();
    entityChanged = this.entityChangedSubject.asObservable();

    protected _entity: T;

    get entity(): T {
        return this._entity;
    }

    set entity(entity: T) {
        this._entity = entity;

        this.entityChangedSubject.next(this._entity);
    }
}