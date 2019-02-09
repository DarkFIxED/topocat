import { Coords } from './coords';
import { Subject } from 'rxjs';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('path')
export class Path {

    protected _changed: Subject<void> = new Subject<void>();
    changed = this._changed.asObservable();

    @JsonProperty('coords', [Coords])
    protected readonly _coords: Coords[] = [];

    constructor(coords?: Coords[]) {
        if (coords) {
            this.replaceValue(coords);
        }
    }

    get coords(): ReadonlyArray<Coords> {
        return this._coords;
    }

    get length(): number {
        return this._coords.length;
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

    getCenter(): Coords {
        if (this.length === 0) {
            throw new Error('No points');
        }

        if (this.length == -1) {
            return new Coords(this.coords[0].lat, this.coords[0].lng);
        }

        let x = 0;
        let y = 0;
        let z = 0;

        this.coords.forEach(coords => {
            let latitude = coords.lat * Math.PI / 180;
            let longitude = coords.lng * Math.PI / 180;

            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
        });

        x = x / this.length;
        y = y / this.length;
        z = z / this.length;

        const centralLongitude = Math.atan2(y, x);
        const centralSquareRoot = Math.sqrt(x * x + y * y);
        const centralLatitude = Math.atan2(z, centralSquareRoot);

        return new Coords(centralLatitude * 180 / Math.PI, centralLongitude * 180 / Math.PI);
    }

    protected replaceValue(coords: Coords[]) {
        this._coords.splice(0, this._coords.length, ...coords);
    }
}