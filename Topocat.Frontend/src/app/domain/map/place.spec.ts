import { Place } from './place';
import { Coords } from './coords';

const delay = ms => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

describe('Place', () => {
    it('getCenter() returns place coords', () => {

        // Arrange.
        let lat = 5.2342535;
        let lng = 2.3141535;
        let place = new Place('', '', new Coords(lat, lng));

        // Act.
        let center = place.getCenter();

        // Assert.
        expect(center.lat).toEqual(lat);
        expect(center.lng).toEqual(lng);
    });

    it('copyFrom() copies all properties from another place', () => {

        // Arrange.
        let place = new Place('title', 'desc', new Coords(34.35555, 0.123444));
        let place2 = new Place();

        // Act.
        place2.copyFrom(place);

        // Assert.
        expect(place2.title).toEqual(place.title);
        expect(place2.description).toEqual(place.description);
        expect(place2.lastModifiedDate).toEqual(place.lastModifiedDate);
        expect(place2.uuid).toEqual(place.uuid);
        expect(place2.coords.lat).toEqual(place.coords.lat);
        expect(place2.coords.lng).toEqual(place.coords.lng);
    });

    it('merge() throws error when current object newest than another', async () => {

        let anotherPlace = new Place();
        await delay(10);
        let currentPlace = new Place();

        // Act.
        expect(function () {
            currentPlace.merge(anotherPlace);
        }).toThrowError();
    });

    it('merge() copies all data except uuid from another object and fires changed observable', async () => {

        // Arrange.
        let firesCount = 0;

        let currentPlace = new Place();

        await delay(10);

        let title = 'title';
        let desc = 'desc';
        let coords = new Coords();
        let anotherPlace = new Place(title, desc, coords);
        currentPlace.changed.subscribe(() => {
            firesCount++;
        });

        // Act.
        currentPlace.merge(anotherPlace);

        // Assert.
        expect(currentPlace.title).toEqual(anotherPlace.title);
        expect(currentPlace.description).toEqual(anotherPlace.description);
        expect(currentPlace.uuid).not.toEqual(anotherPlace.uuid);
        expect(currentPlace.lastModifiedDate.getTime()).toEqual(anotherPlace.lastModifiedDate.getTime());
        expect(currentPlace.coords.lat).toEqual(anotherPlace.coords.lat);
        expect(currentPlace.coords.lng).toEqual(anotherPlace.coords.lng);
        expect(firesCount).toEqual(1);
    });

    it('set title() sets new title value, updates lastModifiedDate and fires changed observable', async () => {

        // Arrange.
        let firesCount = 0;

        let newTitle = 'new title';
        let place = new Place('', '');
        let initialLastModifiedDate = place.lastModifiedDate;
        place.changed.subscribe(() => {
            firesCount++;
        });

        await delay(10);

        // Act.
        place.title = newTitle;

        // Assert.
        expect(place.title).toEqual(newTitle);
        expect(initialLastModifiedDate.getTime()).toBeLessThan(place.lastModifiedDate.getTime());
        expect(firesCount).toEqual(1);
    });

    it('set description() sets new title value, updates lastModifiedDate and fires changed observable', async () => {

        // Arrange.
        let firesCount = 0;

        let newDescription = 'new desc';
        let place = new Place('', '');
        let initialLastModifiedDate = place.lastModifiedDate;
        place.changed.subscribe(() => {
            firesCount++;
        });

        await delay(10);

        // Act.
        place.description = newDescription;

        // Assert.
        expect(place.description).toEqual(newDescription);
        expect(initialLastModifiedDate.getTime()).toBeLessThan(place.lastModifiedDate.getTime());
        expect(firesCount).toEqual(1);
    });
});