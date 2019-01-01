import { MapObject } from './map-object';
import { JsonObject, JsonProperty } from 'json2typescript';
import { Coords } from './coords';

@JsonObject('area')
export class Area extends MapObject {

    @JsonProperty('path', [Coords])
    public path: Coords[];
}