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
    }

    updateCoords(newCoords: Coords) {
        this.updateCoordsFromLatLng(newCoords.lat, newCoords.lng);
    }

    copyFrom(anotherPlace: Place): void {
        this.uuid = anotherPlace.uuid;
        this.title = anotherPlace.title;
        this.description = anotherPlace.description;
        this.updateCoords(anotherPlace.coords);
        this._lastModifiedTimeStamp = anotherPlace._lastModifiedTimeStamp;

        this.emitObjectChanged();
    }
}
