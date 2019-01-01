import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('coords')
export class Coords {

    @JsonProperty('lat')
    public lat: number;

    @JsonProperty('lng')
    public lng: number;
}