import { Coords } from './coords';
import { Subject } from 'rxjs';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('path')
export class Path {

    protected _changed: Subject<void> = new Subject<void>();
    public changed = this._changed.asObservable();

    @JsonProperty('coords', [Coords])
    protected readonly _coords: Coords[] = [];
    public get coords(): ReadonlyArray<Coords> {
        return this._coords;
    }

    public get length(): number {
        return this._coords.length;
    }

    constructor(coords?: Coords[]) {
        if (coords) {
            this.replaceValue(coords);
        }
    }

    append(coords: Coords): void {
        this._coords.push(coords);
        this._changed.next();
    }

    insertAt(coords: Coords, index: number): void {
        this._coords.splice(index, 0, coords);
        this._changed.next();
    }

    removeAt(index: number): void {
        this._coords.splice(index, 1);
        this._changed.next();
    }

    setValue(coords: Coords[]) {
        this.replaceValue(coords);
        this._changed.next();
    }

    updateAt(coords: Coords, index: number) {
        this._coords[index].setValue(coords.lat, coords.lng);
    }

    protected replaceValue(coords: Coords[]) {
        this._coords.splice(0, this._coords.length, ...coords);
    }
}