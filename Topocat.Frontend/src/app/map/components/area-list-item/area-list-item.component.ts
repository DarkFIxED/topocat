import { Component, Input, OnInit } from '@angular/core';
import { Area } from '../../../domain/map/area';
import { MapService } from '../../services/map.service';
import { Message, MessageBusService } from 'litebus';
import { MapObject } from '../../../domain/map/map-object';
import { MessageNames } from '../../../infrastructure/message-names';

@Component({
    selector: 'tc-area-list-item',
    templateUrl: './area-list-item.component.html',
    styleUrls: ['./area-list-item.component.scss']
})
export class AreaListItemComponent implements OnInit {

    @Input()
    public area: Area;

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

    openEditAreaPopup(object: MapObject) {
        let message = new Message(MessageNames.MapActivatePopup, ['edit-area', object.uuid], this);
        this.messageBus.publish(message);
    }
}
