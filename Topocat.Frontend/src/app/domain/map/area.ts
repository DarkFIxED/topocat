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

    copyFrom(anotherArea: Area): any {
        this.title = anotherArea.title;
        this.description = anotherArea.description;
        this.uuid = anotherArea.uuid;

        let newCoords = anotherArea.path.map(coords => new Coords(coords.lat, coords.lng));

        this.path.splice(0, this.path.length, ...newCoords);

        this.emitObjectChanged();
    }

}