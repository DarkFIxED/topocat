import { MapObject } from './map-object';
import { Subject } from 'rxjs';
import { JsonProperty } from 'json2typescript';

export abstract class NameableMapObject extends MapObject {

    public changed: Subject<NameableMapObject> = new Subject<NameableMapObject>();

    @JsonProperty('title')
    protected _title: string;

    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        this._title = title;
        this.emitObjectChanged();
    }

    @JsonProperty('description')
    protected _description: string;

    public get description(): string {
        return this._description;
    }

    public set description(description: string) {
        this._description = description;
        this.emitObjectChanged();
    }

    protected emitObjectChanged() {
        this.changed.next(this);
    }
}