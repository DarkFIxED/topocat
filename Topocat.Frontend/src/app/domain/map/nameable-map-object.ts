import { MapObject } from './map-object';
import { Subject } from 'rxjs';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject
export abstract class NameableMapObject extends MapObject {

    public changed: Subject<NameableMapObject> = new Subject<NameableMapObject>();

    protected constructor(title?: string, description?: string) {
        super();

        this._title = title;
        this._description = description;
    }

    @JsonProperty('title')
    protected _title: string;

    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
        this.updateLastModifiedDate();
        this.emitObjectChanged();
    }

    @JsonProperty('description')
    protected _description: string;

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
        this.updateLastModifiedDate();
        this.emitObjectChanged();
    }

    protected emitObjectChanged() {
        this.changed.next(this);
    }

    public merge(otherObject: NameableMapObject) {
        if (otherObject._lastModifiedTimeStamp <= this._lastModifiedTimeStamp) {
            throw new Error('Current object newest that other.');
        }

        this._title = otherObject._title;
        this._description = otherObject._description;
        this._lastModifiedTimeStamp = otherObject._lastModifiedTimeStamp;
    }
}