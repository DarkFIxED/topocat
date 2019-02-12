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

        // Arrange.
        let firesCount = 0;
        const newValue = 15;

        map.zoomChanged.subscribe(zoomChangedEventArgs => {
            firesCount++;
            expect(zoomChangedEventArgs.zoom).toBe(newValue);
            expect(zoomChangedEventArgs.setFromMap).toBeFalsy();
        });

        // Act.
        map.setZoom(newValue);

        // Assert.
        expect(map.zoom).toBe(newValue);
        expect(firesCount).toEqual(1);
    });

    it('updateZoomFromMap() sets zoom value and emit zoomChanged subject', () => {

        // Arrange.
        let firesCount = 0;
        const newValue = 15;

        map.zoomChanged.subscribe(zoomChangedEventArgs => {
            firesCount++;
            expect(zoomChangedEventArgs.zoom).toBe(newValue);
            expect(zoomChangedEventArgs.setFromMap).toBeTruthy();
        });

        // Act.
        map.updateZoomFromMap(newValue);

        // Assert.
        expect(map.zoom).toBe(newValue);
        expect(firesCount).toEqual(1);
    });

    it('setCenter() sets center value and emit centerChanged subject', () => {

        // Arrange.
        let firesCount = 0;
        const newValue = new Coords(34, 42);

        map.centerChanged.subscribe(centerChangedEventArgs => {
            firesCount++;
            expect(centerChangedEventArgs.center).toBe(newValue);
            expect(centerChangedEventArgs.setFromMap).toBeFalsy();
        });

        // Act.
        map.setCenter(newValue);

        // Assert.
        expect(map.center).toBe(newValue);
        expect(firesCount).toEqual(1);
    });

    it('updateCenterFromMap() sets center value and emit centerChanged subject', () => {

        // Arrange.
        let firesCount = 0;
        const newValue = new Coords(34, 42);

        map.centerChanged.subscribe(centerChangedEventArgs => {
            firesCount++;
            expect(centerChangedEventArgs.center).toBe(newValue);
            expect(centerChangedEventArgs.setFromMap).toBeTruthy();
        });

        // Act.
        map.updateCenterFromMap(newValue);

        // Assert.
        expect(map.center).toBe(newValue);
        expect(firesCount).toEqual(1);
    });

    it('addOrUpdateObject() adds object value and emit objectAdded subject', () => {

        // Arrange.
        let firesCount = 0;
        const place = new Place();

        map.objectAdded.subscribe(addedPlace => {
            firesCount++;
            expect(addedPlace).toBe(place);
        });

        // Act.
        map.addOrUpdateObject(place);

        // Assert.
        expect(map.mapObjects).toContain(place);
        expect(firesCount).toEqual(1);
    });

    it('addOrUpdateObject() updates object value and emit objectAdded subject', () => {

        // Arrange.
        let firesCount = 0;
        const place = new Place();

        map.addOrUpdateObject(place);

        map.objectChanged.subscribe(addedPlace => {
            firesCount++;
            expect(addedPlace).toBe(place);
        });

        // Act.
        map.addOrUpdateObject(place);

        // Assert.
        expect(map.mapObjects).toContain(place);
        expect(firesCount).toEqual(1);
    });

    it('deleteObject() deletes object value and emit objectDeleted subject', () => {

        // Arrange.
        let firesCount = 0;
        const place = new Place();

        map.addOrUpdateObject(place);

        map.objectDeleted.subscribe(deletedPlace => {
            firesCount++;
            expect(deletedPlace).toBe(place);
        });

        // Act.
        map.deleteObject(place.uuid);

        // Assert.
        expect(map.mapObjects).not.toContain(place);
        expect(firesCount).toEqual(1);
    });
});