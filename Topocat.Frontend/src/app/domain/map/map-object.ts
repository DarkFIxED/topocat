import { DomainEntity } from '../../infrastructure/domain-entity';
import { UUID } from 'angular2-uuid';
import { JsonObject, JsonProperty } from 'json2typescript';
import { Coords } from './coords';
import { Subject } from 'rxjs';

@JsonObject
export abstract class MapObject extends DomainEntity {

    @JsonProperty('lastModifiedTimeStamp')
    protected _lastModifiedTimeStamp: number;
    get lastModifiedDate(): Date {
        return new Date(this._lastModifiedTimeStamp)
    }

    @JsonProperty('uuid')
    uuid: string = UUID.UUID();

    protected _changed = new Subject<MapObject>();
    changed = this._changed.asObservable();

    protected constructor() {
        super();
        this.updateLastModifiedDate();
    }

    abstract merge(otherObject: MapObject);

    abstract getCenter(): Coords;

    abstract copy(otherObject: MapObject);

    protected updateLastModifiedDate() {
        let date = new Date();
        this._lastModifiedTimeStamp = date.getTime();
    }

    protected emitObjectChanged() {
        this._changed.next(this);
    }
}