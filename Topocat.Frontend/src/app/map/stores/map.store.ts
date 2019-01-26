import { Injectable } from '@angular/core';
import { Store } from '../../infrastructure/store';
import { Map } from '../../domain/map/map'
import { Observable } from 'rxjs';
import { Coords } from '../../domain/map/coords';
import { MessageNames } from '../../infrastructure/message-names';
import { Message, MessageBusService } from 'litebus';
import { DataContainer } from '../../infrastructure/data-container';
import { JsonSerializer } from '../../infrastructure/json-serializer.service';

@Injectable()
export class MapStore extends Store<Map> {

    constructor(private messageBus: MessageBusService,
                private json: JsonSerializer) {
        super();

        this.entityChangedSubject.subscribe(map => {
            this.setupSubscriptions(map);
            this.setupListeners(map);
        });

        // TODO: load or create new map.
        this.entity = new Map();
    }

    public export(): DataContainer<any> {
        let serializedEntity = this.json.toAnonymous(this.entity);

        return new DataContainer(serializedEntity);
    }

    public import(container: DataContainer<any>): void {
        this.entity = this.json.fromAnonymous(container.data, Map);
    }

    private setupSubscriptions(entity: Map): void {

        let sender = this;

        entity.centerChanged.subscribe(centerChangedEventArgs => {
            let message = new Message(MessageNames.DomainCenterChanged, centerChangedEventArgs, sender);
            this.messageBus.publish(message);
        });

        entity.zoomChanged.subscribe(zoomChangedEventArgs => {
           let message = new Message(MessageNames.DomainZoomChanged, zoomChangedEventArgs, sender);
           this.messageBus.publish(message);
        });
    }

    private setupListeners(entity: Map): void {
        this.messageBus.listen([MessageNames.MapCenterChanged],
            (observable: Observable<Message<Coords>>) => {
                return observable.subscribe(message => {
                    entity.updateCenterFromMap(message.payload);
                });
            });

        this.messageBus.listen([MessageNames.MapZoomChanged],
            (observable: Observable<Message<number>>) => {
                return observable.subscribe(message => {
                    entity.updateZoomFromMap(message.payload);
                });
            });
    }
}