import { Coords } from './coords';
import { Path } from './path';

describe('Path', () => {
    it('constructor(coords) initializes array', () => {

        // Arrange.
        let coords = [new Coords(1, 2), new Coords(2, 3), new Coords(3, 4)];

        // Act.
        let path = new Path(coords);

        // Assert.
        let testResult = path.coords.every(pathCoords =>
            coords.some(originCoords =>
                pathCoords.lat === originCoords.lat && pathCoords.lng === originCoords.lng));
        expect(testResult).toBeTruthy();
    });

    it('constructor() initializes empty array', () => {

        // Act.
        let path = new Path();

        // Assert.
        expect(path.coords.length).toEqual(0);
    });

    it('length property returns amount of coords in path', () => {

        // Arrange.
        let path = new Path();

        // Act and assert.
        for (let i = 1; i <= 10; i++) {
            path.append(new Coords());
            expect(path.length).toEqual(i);
        }

    });

    it('append() adds new coord at the end of array and fires changed observable', () => {

        // Arrange.
        let path = new Path();
        let coords = new Coords(-1, -2);

        path.changed.subscribe(() => {
            expect().nothing();
        });

        // Act.
        path.append(coords);

        // Assert.
        expect(path.length).toEqual(1);
        expect(path.coords[0].lat === coords.lat && path.coords[0].lng === coords.lng).toBeTruthy();
    });

    it('insertAt() inserts coords at the specified position and fires changed observable', () => {

        // Arrange.
        let coords = [new Coords(), new Coords(), new Coords()];
        let path = new Path(coords);

        path.changed.subscribe(() => {
            expect().nothing();
        });

        // Act.
        let newCoords = new Coords(4, 5);
        path.insertAt(newCoords, 1);

        // Assert.
        expect(path.length).toEqual(coords.length + 1);
        expect(path.coords[1].lat === newCoords.lat && path.coords[1].lng === newCoords.lng).toBeTruthy();
    });

    it('removeAt() removes coords at the specified position and fires changed observable', () => {

        // Arrange.
        let coords = [new Coords(), new Coords(4, 3), new Coords(), new Coords()];
        let path = new Path(coords);

        path.changed.subscribe(() => {
            expect().nothing();
        });

        // Act.
        path.removeAt(1);

        // Assert.
        expect(path.length).toEqual(coords.length - 1);
        expect(path.coords.every(x => x.lng === 0 && x.lat === 0)).toBeTruthy();
    });

    it('setValue() replaces value and fires changed observable', () => {

        // Arrange.
        let coords = [new Coords(1,2), new Coords(4, 3), new Coords(6,5), new Coords(4,4)];
        let path = new Path();

        path.changed.subscribe(() => {
            expect().nothing();
        });

        // Act.
        path.setValue(coords);

        // Assert.
        expect(path.length).toEqual(coords.length);
        expect(path.coords.every((x, index) => x.lng === coords[index].lng && x.lat === coords[index].lat)).toBeTruthy();
    });

    it('updateAt() updates value at specified index and fires changed observable', () => {

        // Arrange.
        let coords = [new Coords(1,2), new Coords(4, 3), new Coords(6,5), new Coords(4,4)];
        let path = new Path(coords);

        let coord = new Coords(55,4);
        let changedAt = 2;
        path.changed.subscribe(() => {
            expect().nothing();
        });

        // Act.
        path.updateAt(coord, changedAt);

        // Assert.
        expect(path.length).toEqual(coords.length);
        expect(path.coords.every((x, index) => {

            if (index != changedAt)
                return x.lng === coords[index].lng && x.lat === coords[index].lat;
            else
                return x.lng === coord.lng && x.lat === coord.lat;

        })).toBeTruthy();
    });

});