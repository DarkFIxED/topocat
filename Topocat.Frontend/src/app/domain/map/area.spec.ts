import { Coords } from './coords';
import { Area } from './area';

const delay = ms => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

describe('Area', () => {
    it('constructor(coords[]) creates new Area instance with pre-filled path', () => {

        // Arrange.
        let coords = [new Coords(1, 2), new Coords(2, 3), new Coords(3, 4)];

        // Act.
        let area = new Area('', '', coords);

        // Assert.
        let testResult = area.path.coords.every((pathCoords, index) => {
            return pathCoords.lat === coords[index].lat && pathCoords.lng === coords[index].lng;
        });
        expect(testResult).toBeTruthy();
    });

    it('copyFrom() copies all fields and fires changed observable', () => {

        // Arrange.
        let firesCount = 0;

        let title = 'test title';
        let desc = 'test desc';
        let coords = [new Coords(1, 2), new Coords(2, 3), new Coords(3, 4)];
        let anotherArea = new Area(title, desc, coords);

        let area = new Area();
        area.changed.subscribe(() => {
            firesCount++;
        });

        // Act.
        area.copyFrom(anotherArea);

        // Assert.
        expect(area.title).toEqual(anotherArea.title);
        expect(area.description).toEqual(anotherArea.description);
        expect(area.uuid).toEqual(anotherArea.uuid);
        expect(area.lastModifiedDate).toEqual(anotherArea.lastModifiedDate);
        expect(area.path.coords.every((pathEl, index) => {
            return pathEl.lat === coords[index].lat && pathEl.lng === coords[index].lng;
        })).toBeTruthy();

        expect(firesCount).toEqual(1);
    });

    it('merge() throws error when current object newest than another', async () => {

        let anotherArea = new Area();
        await delay(10);
        let currentArea = new Area();

        // Act.
        expect(function () {
            currentArea.merge(anotherArea);
        }).toThrowError();
    });

    it('merge() copies all data except uuid from another object and fires changed observable', async () => {

        // Arrange.
        let firesCount = 0;

        let currentArea = new Area();

        await delay(10);

        let title = 'title';
        let desc = 'desc';
        let coords = [new Coords(), new Coords()];
        let anotherArea = new Area(title, desc, coords);
        currentArea.changed.subscribe(() => {
            firesCount++;
        });

        // Act.
        currentArea.merge(anotherArea);

        // Assert.
        expect(currentArea.title).toEqual(anotherArea.title);
        expect(currentArea.description).toEqual(anotherArea.description);
        expect(currentArea.uuid).not.toEqual(anotherArea.uuid);
        expect(currentArea.lastModifiedDate.getTime()).toEqual(anotherArea.lastModifiedDate.getTime());
        expect(currentArea.path.coords.every((pathEl, index) => {
            return pathEl.lat === coords[index].lat && pathEl.lng === coords[index].lng;
        })).toBeTruthy();

        expect(firesCount).toEqual(1);
    });

    it('getCenter() returns center of containing path', async () => {

        let accuracy = 0.0001;

        let expectedValue = 0.5;

        // Arrange.
        let area = new Area();

        let pathCoords = [
            new Coords(0, 0),
            new Coords(0, 1),
            new Coords(1, 1),
            new Coords(1, 0)
        ];
        area.path.setValue(pathCoords);

        // Act.
        let center = area.getCenter();

        // Assert.
        expect(Math.abs(center.lat - expectedValue)).toBeLessThanOrEqual(accuracy);
        expect(Math.abs(center.lng - expectedValue)).toBeLessThanOrEqual(accuracy);
    });

});