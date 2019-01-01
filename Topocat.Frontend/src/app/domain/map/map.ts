import { JsonObject, JsonProperty } from 'json2typescript';
import { AggregationRoot } from '../../infrastructure/aggregation-root';
import { MapObject } from './map-object';
import { Place } from './place';
import { Subject } from 'rxjs';
import { Area } from './area';
import { Coords } from './coords';

@JsonObject('map')
export class Map extends AggregationRoot {

    public placeAdded: Subject<Place> = new Subject<Place>();
    public areaAdded: Subject<Area> = new Subject<Area>();

    public centerChanged: Subject<Coords> = new Subject<Coords>();

    @JsonProperty('mapObjects')
    protected _mapObjects: Array<MapObject> = [];

    @JsonProperty('center')
    protected _center: Coords = new Coords();

    public get center(): Coords {
        return this._center;
    }

    public setCenter(center: Coords, emitChanges = true): void {
        this._center = center;

        if (emitChanges) {
            this.centerChanged.next(this._center);
        }
    }

    public addPlace(place: Place): void {
        this._mapObjects.push(place);

        this.placeAdded.next(place);
    }

    public addPlaces(places: Place[]): void {
        this._mapObjects.push(...places);

        for (let place of places) {
            this.placeAdded.next(place);
        }
    }

    public addArea(area: Area): void {
        this._mapObjects.push(area);

        this.areaAdded.next(area);
    }

    public addAreas(areas: Area[]): void {
        this._mapObjects.push(...areas);

        for (let area of areas) {
            this.areaAdded.next(area);
        }
    }
}