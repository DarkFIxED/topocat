import {Component, Input, OnInit} from '@angular/core';
import {MapObjectModel} from '../../models/map-object.model';
import {MapObjectsService} from '../../services/map-objects.service';
import {WktService} from '../../services/wkt.service';
import {WktPrimitives} from '../../models/wkt-primitives';
import {DrawnObjectsStore} from '../../stores/drawn-objects.store';
import {MapService} from '../../services/map.service';

@Component({
    selector: 'app-objects-list-item',
    templateUrl: './objects-list-item.component.html',
    styleUrls: ['./objects-list-item.component.scss']
})
export class ObjectsListItemComponent implements OnInit {
    WktPrimitives = WktPrimitives;
    type = '';

    @Input()
    object: MapObjectModel;

    constructor(private mapObjectsService: MapObjectsService,
                private mapService: MapService,
                private wktService: WktService,
                private drawnObjectsStore: DrawnObjectsStore) {
    }

    ngOnInit() {
        this.type = this.wktService.getWktType(this.object.wktString);
    }

    onDetailsClick(event: MouseEvent) {
        event.stopImmediatePropagation();
        this.mapObjectsService.openPropertiesWindow(this.object.id);
    }

    center() {
        const unifiedMapObject = this.drawnObjectsStore.find(this.object.id);
        const center = unifiedMapObject.getInfoWindowPosition();
        this.mapService.setMapPosition(center.lat, center.lng);
        this.mapObjectsService.setActiveObject(this.object.id);
    }
}
