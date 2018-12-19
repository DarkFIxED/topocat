import { Observable, Subject } from 'rxjs';

export abstract class Store<T> {

    protected constructor() {
    }

    private _modelChanged: Subject<T> = new Subject<T>();
    public get modelChanged$(): Observable<T> {
        return this._modelChanged.asObservable();
    }

    private _model: T;
    public get model(): T {
        return this._model;
    }

    public update(newModel: T): void {
        this._model = newModel;
        this._modelChanged.next(this.model);
    }
}