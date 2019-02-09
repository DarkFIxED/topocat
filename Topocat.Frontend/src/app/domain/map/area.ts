import { JsonObject, JsonProperty } from 'json2typescript';
import { Coords } from './coords';
import { NameableMapObject } from './nameable-map-object';
import { Path } from './path';

@JsonObject('area')
export class Area extends NameableMapObject {

    @JsonProperty('path', Path)
    readonly path: Path;

    constructor(title?: string, description?: string, path?: Coords[]) {
        super(title, description);
        this.path = new Path();

        if (path) {
            this.path.setValue(path);
        }

        this.path.changed.subscribe(() => {
            this.updateLastModifiedDate();
            this.emitObjectChanged();
        });
    }

    merge(otherObject: Area) {
        super.merge(otherObject);
        this.path.setValue(otherObject.path.coords.map(x => new Coords(x.lat, x.lng)), false);

        this.emitObjectChanged();
    }

    getCenter(): Coords {
        return this.path.getCenter();
    }

    copy(otherObject: Area) {
        this.title = otherObject.title;
        this.description = otherObject.description;
        this.uuid = otherObject.uuid;
        this.path.setValue(otherObject.path.coords.map(x => new Coords(x.lat, x.lng)));
        this._lastModifiedTimeStamp = otherObject._lastModifiedTimeStamp;

        this.emitObjectChanged();
    }
}