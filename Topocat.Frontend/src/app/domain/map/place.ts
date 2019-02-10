import { JsonObject, JsonProperty } from 'json2typescript';
import { Coords } from './coords';
import { NameableMapObject } from './nameable-map-object';

@JsonObject('place')
export class Place extends NameableMapObject {

    @JsonProperty('coords', Coords)
    readonly coords: Coords;

    constructor(title?: string, description?: string, coords?: Coords) {
        super(title, description);
        this.coords = new Coords();

        if (coords) {
            this.updateCoords(coords);
        }
    }

    updateCoordsFromLatLng(lat: number, lng: number) {
        this.coords.setValue(lat, lng);
        this.updateLastModifiedDate();
        this.emitObjectChanged();
    }

    updateCoords(newCoords: Coords) {
        this.updateCoordsFromLatLng(newCoords.lat, newCoords.lng);
    }

    merge(otherObject: Place) {
        super.merge(otherObject);
        this.coords.setValue(otherObject.coords.lat, otherObject.coords.lng);

        this.emitObjectChanged();
    }

    getCenter(): Coords {
        return Coords.Copy(this.coords);
    }

    copyFrom(otherObject: Place) {
        this.uuid = otherObject.uuid;
        this._title = otherObject.title;
        this._description = otherObject.description;
        this.coords.setValue(otherObject.coords.lat, otherObject.coords.lng);
        this._lastModifiedTimeStamp = otherObject._lastModifiedTimeStamp;

        this.emitObjectChanged();
    }
}
