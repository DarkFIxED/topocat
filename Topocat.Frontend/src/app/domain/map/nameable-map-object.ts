import { MapObject } from './map-object';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject
export abstract class NameableMapObject extends MapObject {

    protected constructor(title?: string, description?: string) {
        super();

        this._title = title;
        this._description = description;
    }

    @JsonProperty('title')
    protected _title: string;

    get title(): string {
        return this._title;
    }

    set title(title: string) {
        this._title = title;
        this.updateLastModifiedDate();
        this.emitObjectChanged();
    }

    @JsonProperty('description')
    protected _description: string;

    get description(): string {
        return this._description;
    }

    set description(description: string) {
        this._description = description;
        this.updateLastModifiedDate();
        this.emitObjectChanged();
    }

    merge(otherObject: NameableMapObject) {
        if (otherObject._lastModifiedTimeStamp <= this._lastModifiedTimeStamp) {
            throw new Error('Current object newest that other.');
        }

        this._title = otherObject._title;
        this._description = otherObject._description;
        this._lastModifiedTimeStamp = otherObject._lastModifiedTimeStamp;
    }
}