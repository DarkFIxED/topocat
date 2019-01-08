import { Place } from '../../domain/map/place';
import { MapObject } from '../../domain/map/map-object';

export interface MapProvider {

    mapReady: boolean;

    maxZoom: number;

    drawPlace(place: Place): void;

    setDrawnObjectsVisibility(visibility: boolean);

    addOrUpdatePhantom(mapObject: MapObject);

    removePhantom(mapObject: MapObject);

    register();

    unregister();

    centerTo(object: MapObject): void;
}