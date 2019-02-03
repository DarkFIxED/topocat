import { JsonObject, JsonProperty } from 'json2typescript';
import { Coords } from './coords';
import { NameableMapObject } from './nameable-map-object';
import { Path } from './path';

@JsonObject('area')
export class Area extends NameableMapObject {

    @JsonProperty('path', Path)
    public readonly path: Path;

    public constructor(title?: string, description?: string, path?: Coords[]) {
        super(title, description);
        this.path = new Path();

        if (path) {
            this.path.setValue(path);
        }

        this.path.changed.subscribe(() => this.updateLastModifiedDate());
    }

    copyFrom(anotherArea: Area): any {
        this.title = anotherArea.title;
        this.description = anotherArea.description;
        this.uuid = anotherArea.uuid;
        this.path.setValue(anotherArea.path.coords.map(x=>new Coords(x.lat, x.lng)));
        this._lastModifiedTimeStamp = anotherArea._lastModifiedTimeStamp;

        this.emitObjectChanged();
    }

}