import { Injectable } from '@angular/core';
import { Store } from '../../infrastructure/store';
import { Map } from '../../domain/map/map'
import { DataContainer } from '../../infrastructure/data-container';
import { JsonSerializer } from '../../infrastructure/json-serializer.service';
import { MapMerger } from '../../infrastructure/mergers/map.merger';

@Injectable()
export class MapStore extends Store<Map> {

    constructor(private json: JsonSerializer,
                private merger: MapMerger) {
        super();

        // TODO: load or create new map.
        this.entity = new Map();
    }

    export(): DataContainer<any> {
        let serializedEntity = this.json.toAnonymous(this.entity);

        return new DataContainer(serializedEntity);
    }

    import(container: DataContainer<any>): void {
        this.entity = this.json.fromAnonymous(container.data, Map);
    }

    merge(container: DataContainer<any>) {
        let updatedMap = this.json.fromAnonymous(container.data, Map);
        this.merger.merge(this.entity, updatedMap);
    }
}