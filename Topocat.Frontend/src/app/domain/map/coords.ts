import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('coords')
export class Coords {

    @JsonProperty('lat')
    public lat: number;

    @JsonProperty('lng')
    public lng: number;

    constructor(lat: number = 0, lng: number = 0) {
        this.lat = lat;
        this.lng = lng;
    }

}