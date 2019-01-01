import { Injectable } from '@angular/core';
import { Store } from '../../infrastructure/store';
import { Map } from '../../domain/map/map'
import { MessageBusService } from '../../infrastructure/message-bus/message-bus.service';
import { Message } from '../../infrastructure/message-bus/message';
import { Observable } from 'rxjs';
import { Coords } from '../../domain/map/coords';
import { MessageNames } from '../../infrastructure/message-bus/message-names';

@Injectable()
export class MapStore extends Store<Map> {

    constructor(private messageBus: MessageBusService) {
        super();

        this.entitySet.subscribe(map => {
            this.setupSubscriptions(map);
            this.setupListeners(map);
        });

        // TODO: load or create new map.
        this.entity = new Map();
    }

    private setupSubscriptions(entity: Map): void {

        let sender = this;

        entity.areaAdded.subscribe(area => {
            let message = new Message(MessageNames.DomainAreaAdded, area, sender);
            this.messageBus.publish(message);
        });

        entity.placeAdded.subscribe(place => {
            let message = new Message(MessageNames.DomainPlaceAdded, place, sender);
            this.messageBus.publish(message);
        });

        entity.centerChanged.subscribe(center => {
            let message = new Message(MessageNames.DomainCenterChanged, center, sender);
            this.messageBus.publish(message);
        });
    }

    private setupListeners(entity: Map): void {

        this.messageBus.listen([MessageNames.MapCenterChanged],
            (observable: Observable<Message<Coords>>) => {
                return observable.subscribe(message => {
                    entity.setCenter(message.payload, false);
                });
            });
    }
}