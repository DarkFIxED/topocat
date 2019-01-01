import { MapObject } from './map-object';
import { JsonObject, JsonProperty } from 'json2typescript';
import { Coords } from './coords';

@JsonObject('place')
export class Place extends MapObject {

    @JsonProperty('coords')
    public coords: Coords;
}