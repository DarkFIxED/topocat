import { MapService } from './map.service';
import { MapProvider } from '../map-providers/map-provider';
import { Place } from '../../domain/map/place';

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
        let mapProvider: MapProvider = {
            maxZoom: 5,
            drawPlace(place: Place): void {
            },
            register() {
            },
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
        let mapProvider: MapProvider = {
            maxZoom: 5,
            drawPlace(place: Place): void {
            },
            register() {
            },
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
        let mapProvider: MapProvider = {
            maxZoom: 5,
            drawPlace(place: Place): void {
            },
            register() {
            },
            unregister() {
            }
        };
        mapService.register(mapProvider);

        // act, assert
        expect(() => mapService.register(mapProvider)).toThrowError();
    });

    it('Throws error when trying to unregister non-registered provider', () => {

        // arrange
        let mapProvider: MapProvider = {
            maxZoom: 5,
            drawPlace(place: Place): void {
            },
            register() {
            },
            unregister() {
            }
        };

        // act, assert
        expect(() => mapService.unregister(mapProvider)).toThrowError();
    });
});
