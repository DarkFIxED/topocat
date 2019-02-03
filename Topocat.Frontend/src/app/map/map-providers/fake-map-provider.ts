import { MapProvider } from './map-provider';
import { PhantomPlaceCoordsChangedEventArgs } from '../models/phantom-place-coords-changed-event-args';
import { PhantomAreaPathChangedEventArgs } from '../models/phantom-area-path-changed-event-args';
import { Coords } from '../../domain/map/coords';
import { MapObject } from '../../domain/map/map-object';
import { Observable } from 'rxjs';

export class FakeMapProvider implements MapProvider{
    idle: Observable<{ zoom: number; center: Coords }>;
    mapReady: boolean;
    maxZoom: number;
    phantomAreaPathChanged: Observable<PhantomAreaPathChangedEventArgs>;
    phantomPlaceCoordsChanged: Observable<PhantomPlaceCoordsChangedEventArgs>;
    ready: Observable<void>;

    addOrUpdatePhantom(mapObject: MapObject) {
    }

    cancelManualDrawing() {
    }

    centerTo(object: MapObject): void {
    }

    deleteAll() {
    }

    deleteObject(uuid: string) {
    }

    deletePhantom(uuid: string) {
    }

    draw(mapObject: MapObject) {
    }

    drawCoordsManually(): Promise<Coords> {
        return undefined;
    }

    drawMany(mapObjects: MapObject[]): void {
    }

    drawPathManually(): Promise<Coords[]> {
        return undefined;
    }

    isDrawingManually(): boolean {
        return false;
    }

    panToCoords(coords: Coords): void {
    }

    register() {
    }

    setDrawnObjectsVisibility(visibility: boolean) {
    }

    setPhantomsVisibility(visibility: boolean) {
    }

    setZoom(zoom: number) {
    }

    unregister() {
    }

}