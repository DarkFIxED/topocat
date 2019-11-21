import {Component, Input, OnInit} from '@angular/core';
import {MapObjectModel} from '../../models/map-object.model';
import {MapService} from '../../services/map.service';
import {WktService} from '../../services/wkt.service';
import {WktPrimitives} from '../../models/wkt-primitives';
import {DrawnObjectsStore} from '../../stores/drawn-objects.store';

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

    constructor(private mapService: MapService,
                private wktService: WktService,
                private drawnObjectsStore: DrawnObjectsStore) {
    }

    ngOnInit() {
        this.type = this.wktService.getWktType(this.object.wktString);
    }

    openInfoWindow(event: MouseEvent) {
        event.stopImmediatePropagation();
        this.mapService.setActive(this.object.id);
    }

    onEditClick(event: MouseEvent) {
        event.stopImmediatePropagation();
        this.mapService.editMapObject(this.object);
    }

    center() {
        const unifiedMapObject = this.drawnObjectsStore.find(this.object.id);
        const center = unifiedMapObject.getInfoWindowPosition();
        this.mapService.setPosition(center.lat, center.lng);
    }
}
