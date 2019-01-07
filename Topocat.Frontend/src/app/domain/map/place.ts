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
}
