import { AggregationRoot } from '../../infrastructure/aggregation-root';
import { MapObject } from './map-object';
import { Place } from './place';
import { Subject } from 'rxjs';
import { JsonObject, JsonProperty } from 'json2typescript';
import { Area } from './area';

@JsonObject('map')
export class Map extends AggregationRoot {

    public placeAdded: Subject<Place> = new Subject<Place>();
    public areaAdded: Subject<Area> = new Subject<Area>();

    @JsonProperty('mapObjects')
    protected mapObjects: Array<MapObject> = [];

    public addPlace(place: Place): void {
        this.mapObjects.push(place);

        this.placeAdded.next(place);
    }

    public addPlaces(places: Place[]): void {
        this.mapObjects.push(...places);

        for (let place of places) {
            this.placeAdded.next(place);
        }
    }

    public addArea(area: Area): void {
        this.mapObjects.push(area);

        this.areaAdded.next(area);
    }

    public addAreas(areas: Area[]): void {
        this.mapObjects.push(...areas);

        for (let area of areas) {
            this.areaAdded.next(area);
        }
    }
}