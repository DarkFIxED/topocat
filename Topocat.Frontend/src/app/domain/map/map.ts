import { JsonObject, JsonProperty } from 'json2typescript';
import { AggregationRoot } from '../../infrastructure/aggregation-root';
import { MapObject } from './map-object';
import { Subject } from 'rxjs';
import { Coords } from './coords';
import { CenterChangedEventArgs } from './event-args/center-changed.event-args';
import { ZoomChangedEventArgs } from './event-args/zoom-changed.event-args';
import { MapObjectsArrayConverter } from '../../infrastructure/converters/map-objects-array.converter';

@JsonObject('map')
export class Map extends AggregationRoot {

    protected _centerChanged: Subject<CenterChangedEventArgs> = new Subject<CenterChangedEventArgs>();
    centerChanged = this._centerChanged.asObservable();

    protected _zoomChanged: Subject<ZoomChangedEventArgs> = new Subject<ZoomChangedEventArgs>();
    zoomChanged = this._zoomChanged.asObservable();

    protected _objectDeleted: Subject<MapObject> = new Subject<MapObject>();
    objectDeleted = this._objectDeleted.asObservable();

    protected _objectAdded: Subject<MapObject> = new Subject<MapObject>();
    objectAdded = this._objectAdded.asObservable();

    protected _objectChanged: Subject<MapObject> = new Subject<MapObject>();
    objectChanged = this._objectChanged.asObservable();

    @JsonProperty('mapObjects', MapObjectsArrayConverter)
    protected _mapObjects: Array<MapObject> = [];

    get mapObjects(): Array<MapObject> {
        return this._mapObjects;
    }

    @JsonProperty('center', Coords)
    protected _center: Coords = new Coords();
    get center(): Coords {
        return this._center;
    }

    @JsonProperty('zoom')
    protected _zoom: number = 10;
    get zoom(): number {
        return this._zoom;
    }

    protected objectsSubscriptions = {};

    setZoom(zoom: number): void {
        this._zoom = zoom;
        this._zoomChanged.next(new ZoomChangedEventArgs(this._zoom, false));
    }

    updateZoomFromMap(zoom: number): void {
        this._zoom = zoom;
        this._zoomChanged.next(new ZoomChangedEventArgs(this._zoom, true));
    }

    setCenter(center: Coords): void {
        this._center = center;
        this._centerChanged.next(new CenterChangedEventArgs(this._center, false));
    }

    updateCenterFromMap(center: Coords): void {
        this._center = center;
        this._centerChanged.next(new CenterChangedEventArgs(this._center, true));
    }

    addOrUpdateObject(mapObject: MapObject) {
        let existingObject = this.getObject(mapObject.uuid);
        if (!existingObject) {
           this.addObject(mapObject);
        } else {
            existingObject.copy(mapObject);
        }
    }

    getObject(uuid: string): MapObject {
        return this.mapObjects.find(x => x.uuid === uuid);
    }

    deleteObject(uuid: string): void {
        let index = this.mapObjects.findIndex(x => x.uuid === uuid);
        if (index >= 0) {
            let object = this.mapObjects[index];

            this.objectsSubscriptions[uuid].unsubscribe();
            delete this.objectsSubscriptions[uuid];

            this._mapObjects.splice(index, 1);
            this._objectDeleted.next(object);
        }
    }

    protected addObject(object: MapObject): void {
        this._mapObjects.push(object);
        this.objectsSubscriptions[object.uuid] = object.changed.subscribe(object => this._objectChanged.next(object));
        this._objectAdded.next(object);
    }
}