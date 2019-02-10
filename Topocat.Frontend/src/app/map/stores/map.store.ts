import { Injectable } from '@angular/core';
import { Store } from '../../infrastructure/store';
import { Map } from '../../domain/map/map'
import { DataContainer } from '../../infrastructure/data-container';
import { JsonSerializer } from '../../infrastructure/json-serializer.service';
import { MapMerger } from '../../infrastructure/mergers/map.merger';
import { Subject, Subscription } from 'rxjs';
import { MapObject } from '../../domain/map/map-object';
import { CenterChangedEventArgs } from '../../domain/map/event-args/center-changed.event-args';
import { ZoomChangedEventArgs } from '../../domain/map/event-args/zoom-changed.event-args';

@Injectable()
export class MapStore extends Store<Map> {

    protected _objectChangedSubscription: Subscription;
    protected _objectChanged: Subject<MapObject> = new Subject<MapObject>();
    objectChanged = this._objectChanged.asObservable();

    protected _objectAddedSubscription: Subscription;
    protected _objectAdded: Subject<MapObject> = new Subject<MapObject>();
    objectAdded = this._objectAdded.asObservable();

    protected _objectDeletedSubscription: Subscription;
    protected _objectDeleted: Subject<MapObject> = new Subject<MapObject>();
    objectDeleted = this._objectDeleted.asObservable();

    protected _centerChangedSubscription: Subscription;
    protected _centerChanged: Subject<CenterChangedEventArgs> = new Subject<CenterChangedEventArgs>();
    centerChanged = this._centerChanged.asObservable();

    protected _zoomChangedSubscription: Subscription;
    protected _zoomChanged: Subject<ZoomChangedEventArgs> = new Subject<ZoomChangedEventArgs>();
    zoomChanged = this._zoomChanged.asObservable();

    constructor(private json: JsonSerializer,
                private merger: MapMerger) {
        super();

        // TODO: load or create new map.
        this.entity = new Map();
    }

    get entity(): Map {
        return this._entity;
    }

    set entity(entity: Map) {
        if (this._objectAddedSubscription) {
            this._objectAddedSubscription.unsubscribe();
        }

        if (this._objectChangedSubscription) {
            this._objectChangedSubscription.unsubscribe();
        }

        if (this._objectDeletedSubscription) {
            this._objectDeletedSubscription.unsubscribe();
        }

        if (this._centerChangedSubscription) {
            this._centerChangedSubscription.unsubscribe();
        }

        if (this._zoomChangedSubscription) {
            this._zoomChangedSubscription.unsubscribe();
        }

        this._objectAddedSubscription = entity.objectAdded.subscribe(value => this._objectAdded.next(value));
        this._objectChangedSubscription = entity.objectChanged.subscribe(value => this._objectChanged.next(value));
        this._objectDeletedSubscription = entity.objectDeleted.subscribe(value => this._objectDeleted.next(value));
        this._centerChangedSubscription = entity.centerChanged.subscribe(value => this._centerChanged.next(value));
        this._zoomChangedSubscription = entity.zoomChanged.subscribe(value => this._zoomChanged.next(value));

        this._entity = entity;
        this.entityChangedSubject.next(this._entity);
    }

    export(): DataContainer<any> {
        let serializedEntity = this.json.toAnonymous(this.entity);

        return new DataContainer(serializedEntity);
    }

    import(container: DataContainer<any>): void {
        this.entity = this.json.fromAnonymous(container.data, Map);
    }

    merge(container: DataContainer<any>) {
        let updatedMap = this.json.fromAnonymous(container.data, Map);
        this.merger.merge(this.entity, updatedMap);
    }
}