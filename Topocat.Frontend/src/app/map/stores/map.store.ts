import { Injectable } from '@angular/core';
import { Store } from '../../infrastructure/store';
import { Map } from '../../domain/map/map'
import { MessageBusService } from '../../infrastructure/message-bus/message-bus.service';
import { Message } from '../../infrastructure/message-bus/message';

@Injectable()
export class MapStore extends Store<Map> {

    constructor(private messageBus: MessageBusService) {
        super();

        this.entitySet.subscribe(map => this.setupSubscriptions(map));

        // TODO: load or create new map.
        this.entity = new Map();
    }

    private setupSubscriptions(entity: Map): void {

        entity.areaAdded.subscribe(area => {
            let message = new Message('MAP_AREA_ADDED', area);
            this.messageBus.publish(message);
        });

        entity.placeAdded.subscribe(place => {
            let message = new Message('MAP_PLACE_ADDED', place);
            this.messageBus.publish(message);
        })
    }
}