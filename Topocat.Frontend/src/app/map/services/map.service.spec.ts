import { MapService } from './map.service';
import { MapProvider } from '../map-providers/map-provider';
import { Coords } from '../../domain/map/coords';
import { MapObject } from '../../domain/map/map-object';
import { Observable } from 'rxjs';
import { PhantomAreaPathChangedEventArgs } from '../models/phantom-area-path-changed-event-args';
import { PhantomPlaceCoordsChangedEventArgs } from '../models/phantom-place-coords-changed-event-args';

describe('MapService', () => {

    let mapService: MapService;

    beforeEach(() => {
        mapService = new MapService();
    });

    it('No provider right after instantiation', () => {

        // assert
        expect(mapService.hasProvider).toBeFalsy();
        expect(mapService.provider).toBeUndefined();
    });

    it('Has provider after registration', () => {

        // arrange
        let mapProvider: MapProvider = new class implements MapProvider {
            idle: Observable<{ zoom: number; center: Coords }>;
            mapReady: boolean;
            maxZoom: number;
            phantomAreaPathChanged: Observable<PhantomAreaPathChangedEventArgs>;
            phantomPlaceCoordsChanged: Observable<PhantomPlaceCoordsChangedEventArgs>;
            ready: Observable<void>;

            addOrUpdatePhantom(mapObject: MapObject) {
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

            drawMany(mapObjects: MapObject[]): void {
            }

            panToCoords(coords: Coords): void {
            }

            register() {
            }

            setDrawnObjectsVisibility(visibility: boolean) {
            }

            setZoom(zoom: number) {
            }

            unregister() {
            }
        };

        // act
        mapService.register(mapProvider);

        // assert
        expect(mapService.hasProvider).toBeTruthy();
        expect(mapService.provider).toEqual(mapProvider);
    });

    it('No provider after un-registration', () => {

        // arrange
        let mapProvider: MapProvider = new class implements MapProvider {
            idle: Observable<{ zoom: number; center: Coords }>;
            mapReady: boolean;
            maxZoom: number;
            phantomAreaPathChanged: Observable<PhantomAreaPathChangedEventArgs>;
            phantomPlaceCoordsChanged: Observable<PhantomPlaceCoordsChangedEventArgs>;
            ready: Observable<void>;

            addOrUpdatePhantom(mapObject: MapObject) {
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

            drawMany(mapObjects: MapObject[]): void {
            }

            panToCoords(coords: Coords): void {
            }

            register() {
            }

            setDrawnObjectsVisibility(visibility: boolean) {
            }

            setZoom(zoom: number) {
            }

            unregister() {
            }
        };
        // act
        mapService.register(mapProvider);
        mapService.unregister(mapProvider);

        // assert
        expect(mapService.hasProvider).toBeFalsy();
        expect(mapService.provider).toBeUndefined();
    });

    it('Throws error when trying to override registered provider', () => {

        // arrange
        let mapProvider: MapProvider = new class implements MapProvider {
            idle: Observable<{ zoom: number; center: Coords }>;
            mapReady: boolean;
            maxZoom: number;
            phantomAreaPathChanged: Observable<PhantomAreaPathChangedEventArgs>;
            phantomPlaceCoordsChanged: Observable<PhantomPlaceCoordsChangedEventArgs>;
            ready: Observable<void>;

            addOrUpdatePhantom(mapObject: MapObject) {
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

            drawMany(mapObjects: MapObject[]): void {
            }

            panToCoords(coords: Coords): void {
            }

            register() {
            }

            setDrawnObjectsVisibility(visibility: boolean) {
            }

            setZoom(zoom: number) {
            }

            unregister() {
            }
        };
        mapService.register(mapProvider);

        // act, assert
        expect(() => mapService.register(mapProvider)).toThrowError();
    });

    it('Throws error when trying to unregister non-registered provider', () => {

        // arrange
        let mapProvider: MapProvider = new class implements MapProvider {
            idle: Observable<{ zoom: number; center: Coords }>;
            mapReady: boolean;
            maxZoom: number;
            phantomAreaPathChanged: Observable<PhantomAreaPathChangedEventArgs>;
            phantomPlaceCoordsChanged: Observable<PhantomPlaceCoordsChangedEventArgs>;
            ready: Observable<void>;

            addOrUpdatePhantom(mapObject: MapObject) {
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

            drawMany(mapObjects: MapObject[]): void {
            }

            panToCoords(coords: Coords): void {
            }

            register() {
            }

            setDrawnObjectsVisibility(visibility: boolean) {
            }

            setZoom(zoom: number) {
            }

            unregister() {
            }
        };

        // act, assert
        expect(() => mapService.unregister(mapProvider)).toThrowError();
    });
});
