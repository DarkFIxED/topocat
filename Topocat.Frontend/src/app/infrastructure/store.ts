import { AggregationRoot } from './aggregation-root';
import { Subject } from 'rxjs';

export abstract class Store<T extends AggregationRoot> {
    protected entityChangedSubject: Subject<T> = new Subject<T>();
    public entityChanged = this.entityChangedSubject.asObservable();

    protected _entity: T;

    public get entity(): T {
        return this._entity;
    }

    public set entity(entity: T) {
        this._entity = entity;

        this.entityChangedSubject.next(this._entity);
    }
}