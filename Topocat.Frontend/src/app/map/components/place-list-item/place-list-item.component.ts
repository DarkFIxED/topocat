import { Component, Input, OnInit } from '@angular/core';
import { Place } from '../../../domain/map/place';
import { MapObject } from '../../../domain/map/map-object';
import { MapService } from '../../services/map.service';
import { Message, MessageBusService } from 'litebus';
import { MessageNames } from '../../../infrastructure/message-names';

@Component({
    selector: 'tc-place-list-item',
    templateUrl: './place-list-item.component.html',
    styleUrls: ['./place-list-item.component.scss']
})
export class PlaceListItemComponent implements OnInit {

    @Input()
    place: Place;

    constructor(
        private mapService: MapService,
        private messageBus: MessageBusService,
    ) {
    }

    ngOnInit() {
    }

    centerToObject(object: MapObject) {
        this.mapService.provider.centerTo(object);
    }

    openEditPlacePopup(object: MapObject) {
        let message = new Message(MessageNames.MapActivatePopup, ['edit-place', object.uuid], this);
        this.messageBus.publish(message);
    }

}
