import { Component, OnInit } from '@angular/core';
import { MapStore } from '../../stores/map.store';
import { MapService } from '../../services/map.service';
import { MapObject } from '../../../domain/map/map-object';
import { Place } from '../../../domain/map/place';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageBusService } from 'litebus';
import { MessageNames } from '../../../infrastructure/message-names';

@Component({
    selector: 'tc-map-objects-list',
    templateUrl: './map-objects-list.component.html',
    styleUrls: ['./map-objects-list.component.css']
})
export class MapObjectsListComponent implements OnInit {

    public Place = Place;

    public entities: Array<MapObject> = [];


    constructor(
        private mapStore: MapStore,
        private mapService: MapService,
        private router: Router,
        private route: ActivatedRoute,
        private messageBus: MessageBusService
    ) {
    }

    ngOnInit() {
        this.entities = this.mapStore.entity.mapObjects;
    }

    getType(object: MapObject): string {
        return object.constructor.name;
    }

    openNewPlacePopup() {
        let message = new Message(MessageNames.MapActivatePopup, ['new-place'], this);
        this.messageBus.publish(message);
    }

    centerToObject(object: MapObject) {
        this.mapService.provider.centerTo(object);
    }

    openEditPlacePopup(object: MapObject) {
        let message = new Message(MessageNames.MapActivatePopup, ['edit-place', object.uuid], this);
        this.messageBus.publish(message);
    }
}
