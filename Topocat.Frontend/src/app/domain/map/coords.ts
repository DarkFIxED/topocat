import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('coords')
export class Coords {

    @JsonProperty('lat')
    protected _lat: number;

    public get lat(): number {
        return this._lat;
    }

    @JsonProperty('lng')
    protected _lng: number;

    public get lng(): number {
        return this._lng;
    }

    constructor(lat: number = 0, lng: number = 0) {
        this.setValue(lat, lng);
    }

    setValue(lat: number, lng: number) {
        this._lat = lat;
        this._lng = lng;
    }

    getLatLng(): {lat: number, lng: number} {
        return {
            lat: this._lat,
            lng: this._lng
        };
    }
}