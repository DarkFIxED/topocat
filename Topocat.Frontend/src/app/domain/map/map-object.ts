import { DomainEntity } from '../../infrastructure/domain-entity';
import { UUID } from 'angular2-uuid';
import { JsonObject, JsonProperty } from 'json2typescript';
import { Coords } from './coords';

@JsonObject
export abstract class MapObject extends DomainEntity {

    @JsonProperty('lastModifiedTimeStamp')
    protected _lastModifiedTimeStamp: number;
    public get lastModifiedDate(): Date {
        return new Date(this._lastModifiedTimeStamp)
    }

    @JsonProperty('uuid')
    public uuid: string = UUID.UUID();

    protected constructor() {
        super();
        this.updateLastModifiedDate();
    }

    protected updateLastModifiedDate() {
        let date = new Date();
        this._lastModifiedTimeStamp = date.getTime();
    }

    abstract merge(otherObject: MapObject);

    abstract getCenter(): Coords;
}