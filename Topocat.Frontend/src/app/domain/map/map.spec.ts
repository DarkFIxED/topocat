import { Map } from './map';
import { Coords } from './coords';
import { Place } from './place';

// Straight Jasmine testing without Angular's testing support
describe('Map', () => {
    let map: Map;

    beforeEach(() => {
        map = new Map();
    });

    it('setZoom() sets zoom value and emit zoomChanged subject', () => {
        const newValue = 15;

        map.zoomChanged.subscribe(zoomChangedEventArgs => {
           expect(zoomChangedEventArgs.zoom).toBe(newValue);
           expect(zoomChangedEventArgs.setFromMap).toBeFalsy();
        });

        map.setZoom(newValue);

        expect(map.zoom).toBe(newValue);
    });

    it('updateZoomFromMap() sets zoom value and emit zoomChanged subject', () => {
        const newValue = 15;

        map.zoomChanged.subscribe(zoomChangedEventArgs => {
            expect(zoomChangedEventArgs.zoom).toBe(newValue);
            expect(zoomChangedEventArgs.setFromMap).toBeTruthy();
        });

        map.updateZoomFromMap(newValue);

        expect(map.zoom).toBe(newValue);
    });

    it('setCenter() sets center value and emit centerChanged subject', () => {
        const newValue = new Coords(34, 42);

        map.centerChanged.subscribe(centerChangedEventArgs => {
            expect(centerChangedEventArgs.center).toBe(newValue);
            expect(centerChangedEventArgs.setFromMap).toBeFalsy();
        });

        map.setCenter(newValue);

        expect(map.center).toBe(newValue);
    });

    it('updateCenterFromMap() sets center value and emit centerChanged subject', () => {
        const newValue = new Coords(34, 42);

        map.centerChanged.subscribe(centerChangedEventArgs => {
            expect(centerChangedEventArgs.center).toBe(newValue);
            expect(centerChangedEventArgs.setFromMap).toBeTruthy();
        });

        map.updateCenterFromMap(newValue);

        expect(map.center).toBe(newValue);
    });

    it('addOrUpdatePlace() adds place value and emit placeAdded subject', () => {
        const place =new Place(undefined, undefined, new Coords(32,23));

        map.objectAdded.subscribe(addedPlace => {
            expect(addedPlace).toBe(place);
        });

        map.addOrUpdatePlace(place);

        expect(map.mapObjects).toContain(place);
    });

    it('addObject() adds some places value and emit objectAdded subjects', () => {
        const place1 = new Place(undefined, undefined, new Coords(32,23));
        const place2 = new Place(undefined, undefined, new Coords(33,24));

        let places = [place1, place2];

        map.objectAdded.subscribe(addedPlace => {
            let has = places.some(x=>x.uuid === addedPlace.uuid);
            expect(has).toBeTruthy();
        });

        map.addObject(place1);
        map.addObject(place2);

        expect(map.mapObjects).toContain(place1);
        expect(map.mapObjects).toContain(place2);
    });
});