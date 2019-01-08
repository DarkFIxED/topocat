import { JsonObject, JsonProperty } from 'json2typescript';
import { Coords } from './coords';
import { NameableMapObject } from './nameable-map-object';

@JsonObject('place')
export class Place extends NameableMapObject {

    @JsonProperty('coords')
    public coords: Coords;

    public constructor(title?: string, description?: string, coords?: Coords) {
        super(title, description);

        if (coords) {
            this.coords = coords;
        } else {
            this.coords = new Coords();
        }
    }

    public copyFrom(anotherPlace: Place): void {
        this.title = anotherPlace.title;
        this.description = anotherPlace.description;
        this.coords.lat = anotherPlace.coords.lat;
        this.coords.lng = anotherPlace.coords.lng;
        this.uuid = anotherPlace.uuid;
    }
}
