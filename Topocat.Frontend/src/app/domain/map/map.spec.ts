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

    it('addOrUpdateObject() adds object value and emit objectAdded subject', () => {
        const place = new Place(undefined, undefined, new Coords(32, 23));

        map.objectAdded.subscribe(addedPlace => {
            expect(addedPlace).toBe(place);
        });

        map.addOrUpdateObject(place);

        expect(map.mapObjects).toContain(place);
    });

    it('addOrUpdateObject() updates object value and emit objectAdded subject', () => {
        // Arrange.
        const place = new Place(undefined, undefined, new Coords(32, 23));

        map.addOrUpdateObject(place);

        map.objectChanged.subscribe(addedPlace => {
            expect(addedPlace).toBe(place);
        });

        // Act.
        map.addOrUpdateObject(place);

        // Assert.
        expect(map.mapObjects).toContain(place);
    });

    it('deleteObject() deletes object value and emit objectDeleted subject', () => {
        // Arrange.
        const place = new Place(undefined, undefined, new Coords(32, 23));

        map.addOrUpdateObject(place);

        map.objectDeleted.subscribe(deletedPlace => {
            expect(deletedPlace).toBe(place);
        });

        // Act.
        map.deleteObject(place.uuid);

        // Assert.
        expect(map.mapObjects).not.toContain(place);
    });
});