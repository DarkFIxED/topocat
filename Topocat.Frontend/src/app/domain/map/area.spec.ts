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
        let title = 'test title';
        let desc = 'test desc';
        let coords = [new Coords(1, 2), new Coords(2, 3), new Coords(3, 4)];
        let anotherArea = new Area(title, desc, coords);

        let area = new Area();
        area.changed.subscribe(() => {
            expect().nothing();
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
        let currentArea = new Area();

        await delay(10);

        let title = 'title';
        let desc = 'desc';
        let coords = [new Coords(), new Coords()];
        let anotherArea = new Area(title, desc, coords);
        currentArea.changed.subscribe(() => {
            expect().nothing();
        });

        // Act.
        currentArea.merge(anotherArea);

        // Assert.
        expect(currentArea.title).toEqual(anotherArea.title);
        expect(currentArea.description).toEqual(anotherArea.description);
        expect(currentArea.uuid).not.toEqual(anotherArea.uuid);
        expect(currentArea.lastModifiedDate).toEqual(anotherArea.lastModifiedDate);
        expect(currentArea.path.coords.every((pathEl, index) => {
            return pathEl.lat === coords[index].lat && pathEl.lng === coords[index].lng;
        })).toBeTruthy();
    });

});