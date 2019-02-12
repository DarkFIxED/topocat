import { MapStore } from './map.store';
import { JsonSerializer } from '../../infrastructure/json-serializer.service';
import { MapMerger } from '../../infrastructure/mergers/map.merger';
import { Map } from '../../domain/map/map';
import { Place } from '../../domain/map/place';
import { Coords } from '../../domain/map/coords';

describe('MapStore', () => {
    let mapStore: MapStore;

    beforeEach(() => {
        mapStore = new MapStore(new JsonSerializer(), new MapMerger());
    });

    it('entity not set after initialization', () => {
        expect(mapStore.entity).toBeUndefined();
    });

    it('set entity() sets entity property, resubscribes all facade observables and fires entityChanged observable', () => {

        // Arrange.
        let firesCount = 0;
        let incFunc = () => {
            firesCount++
        };

        let map1 = new Map();
        let map2 = new Map();
        let place = new Place();

        mapStore.entityChanged.subscribe(incFunc);
        mapStore.objectChanged.subscribe(incFunc);
        mapStore.objectAdded.subscribe(incFunc);
        mapStore.objectDeleted.subscribe(incFunc);
        mapStore.centerChanged.subscribe(incFunc);
        mapStore.zoomChanged.subscribe(incFunc);

        let operationsSet = (map: Map) => {
            mapStore.entity = map;
            map.addOrUpdateObject(place);
            place.title = 'new';
            map.deleteObject(place.uuid);
            map.setZoom(3);
            map.setCenter(new Coords(4,4));
        };

        // Act.
        operationsSet(map1);
        operationsSet(map2);

        // Assert.
        expect(firesCount).toEqual(12);
    });
});