import { AggregationRoot } from './aggregation-root';
import { Subject } from 'rxjs';

export abstract class Store<T extends AggregationRoot> {
    protected entitySet: Subject<T> = new Subject<T>();

    protected _entity: T;

    public get entity(): T {
        return this._entity;
    }

    public set entity(entity: T) {
        this._entity = entity;

        this.entitySet.next(this._entity);
    }
}