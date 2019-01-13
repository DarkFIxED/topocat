import { JsonObject, JsonProperty } from 'json2typescript';
import { Coords } from './coords';
import { NameableMapObject } from './nameable-map-object';

@JsonObject('area')
export class Area extends NameableMapObject {

    @JsonProperty('path', [Coords])
    public path: Coords[];

    public constructor(title?: string, description?: string, path?: Coords[]) {
        super(title, description);

        if (!path) {
            this.path = [];
        } else {
            this.path = path;
        }
    }
}