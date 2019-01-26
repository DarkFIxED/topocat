import { JsonObject, JsonProperty } from 'json2typescript';
import { AggregationRoot } from '../../infrastructure/aggregation-root';
import { MapObject } from './map-object';
import { Place } from './place';
import { Subject } from 'rxjs';
import { Area } from './area';
import { Coords } from './coords';
import { CenterChangedEventArgs } from './event-args/center-changed.event-args';
import { ZoomChangedEventArgs } from './event-args/zoom-changed.event-args';
import { MapObjectsArrayConverter } from '../../infrastructure/converters/map-objects-array.converter';

@JsonObject('map')
export class Map extends AggregationRoot {

    public centerChanged: Subject<CenterChangedEventArgs> = new Subject<CenterChangedEventArgs>();
    public zoomChanged: Subject<ZoomChangedEventArgs> = new Subject<ZoomChangedEventArgs>();

    public objectDeleted: Subject<MapObject> = new Subject<MapObject>();
    public objectAdded: Subject<MapObject> = new Subject<MapObject>();


    @JsonProperty('mapObjects', MapObjectsArrayConverter)
    protected _mapObjects: Array<MapObject> = [];

    public get mapObjects(): Array<MapObject> {
        return this._mapObjects;
    }

    @JsonProperty('center', Coords)
    protected _center: Coords = new Coords();

    public get center(): Coords {
        return this._center;
    }

    @JsonProperty('zoom')
    protected _zoom: number = 10;

    public get zoom(): number {
        return this._zoom;
    }

    public setZoom(zoom: number): void {
        this._zoom = zoom;

        this.zoomChanged.next(new ZoomChangedEventArgs(this._zoom, false));
    }

    public updateZoomFromMap(zoom: number): void {
        this._zoom = zoom;

        this.zoomChanged.next(new ZoomChangedEventArgs(this._zoom, true));
    }

    public setCenter(center: Coords): void {
        this._center = center;

        this.centerChanged.next(new CenterChangedEventArgs(this._center, false));
    }

    public updateCenterFromMap(center: Coords): void {
        this._center = center;

        this.centerChanged.next(new CenterChangedEventArgs(this._center, true));
    }

    public addOrUpdatePlace(place: Place): void {
        let existingPlace = <Place>this.getObject(place.uuid);
        if (!existingPlace) {
            this._mapObjects.push(place);
            this.objectAdded.next(place);
        } else {
            existingPlace.copyFrom(place);
        }
    }

    public addPlaces(places: Place[]): void {
        this._mapObjects.push(...places);

        for (let place of places) {
            this.objectAdded.next(place);
        }
    }

    public addOrUpdateArea(area: Area): void {
        let existingArea = <Area>this.getObject(area.uuid);
        if (!existingArea) {
            this._mapObjects.push(area);
            this.objectAdded.next(area);
        } else {
            existingArea.copyFrom(area);
        }
    }

    public addAreas(areas: Area[]): void {
        this._mapObjects.push(...areas);

        for (let area of areas) {
            this.objectAdded.next(area);
        }
    }

    public getObject(uuid: string): MapObject {
        return this.mapObjects.find(x => x.uuid === uuid);
    }

    public deleteObject(uuid: string): void {
        let index = this.mapObjects.findIndex(x => x.uuid === uuid);
        if (index >= 0) {
            let object = this.mapObjects[index];

            this._mapObjects.splice(index, 1);
            this.objectDeleted.next(object);
        }
    }
}