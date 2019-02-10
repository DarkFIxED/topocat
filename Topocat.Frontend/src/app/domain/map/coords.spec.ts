import { Coords } from './coords';

describe('Coords', () => {

    it('setValue() sets correct value', () => {

        // Arrange.
        let coords = new Coords();
        let lat = 4.323;
        let lng = 21.12312;

        // Act.
        coords.setValue(lat, lng);

        // Assert.
        expect(coords.lat).toEqual(lat);
        expect(coords.lng).toEqual(lng);
    });

    it('Copy() returns copy of object', () => {

        // Arrange.
        let lat = 4.323;
        let lng = 21.12312;
        let coords = new Coords(lat, lng);

        // Act.
        let copy = Coords.Copy(coords);

        // Assert.
        expect(copy.lat).toEqual(lat);
        expect(copy.lng).toEqual(lng);
    });

    it('getLatLng() returns correct value', () => {

        // Arrange.
        let lat = 4.323;
        let lng = 21.12312;
        let coords = new Coords(lat, lng);

        // Act.
        let returnedValue = coords.getLatLng();

        // Assert.
        expect(returnedValue.lat).toEqual(lat);
        expect(returnedValue.lng).toEqual(lng);
    });
});