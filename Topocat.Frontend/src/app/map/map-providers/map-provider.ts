import { MapObject } from '../../domain/map/map-object';
import { Observable } from 'rxjs';
import { Coords } from '../../domain/map/coords';
import { PhantomPlaceCoordsChangedEventArgs } from '../models/phantom-place-coords-changed-event-args';
import { PhantomAreaPathChangedEventArgs } from '../models/phantom-area-path-changed-event-args';

export interface MapProvider {

    mapReady: boolean;

    maxZoom: number;

    draw(mapObject: MapObject);

    setDrawnObjectsVisibility(visibility: boolean);

    addOrUpdatePhantom(mapObject: MapObject);

    removePhantom(mapObject: MapObject);

    register();

    unregister();

    centerTo(object: MapObject): void;

    panToCoords(coords: Coords): void;

    setZoom(zoom: number);

    deleteObject(uuid: string);

    idle: Observable<{zoom: number, center: Coords}>;

    phantomPlaceCoordsChanged: Observable<PhantomPlaceCoordsChangedEventArgs>;

    phantomAreaPathChanged: Observable<PhantomAreaPathChangedEventArgs>;

    ready: Observable<void>;
}