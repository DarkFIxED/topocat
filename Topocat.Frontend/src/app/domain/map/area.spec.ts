import { Coords } from './coords';
import { Path } from './path';
import { Area } from './area';

describe('Path', () => {
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
        area.changed.subscribe(()=> {
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
});