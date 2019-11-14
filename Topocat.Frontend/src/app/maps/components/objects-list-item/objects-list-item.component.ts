import {Component, Input, OnInit} from '@angular/core';
import {MapObjectModel} from '../../models/map-object.model';
import {MapService} from '../../services/map.service';
import {WktService} from '../../services/wkt.service';

@Component({
    selector: 'app-objects-list-item',
    templateUrl: './objects-list-item.component.html',
    styleUrls: ['./objects-list-item.component.scss']
})
export class ObjectsListItemComponent implements OnInit {

    type = '';

    @Input()
    object: MapObjectModel;

    constructor(private mapService: MapService,
                private wktService: WktService) {
    }

    ngOnInit() {
        this.type = this.wktService.getWktType(this.object.wktString);
    }

    onCenterClick() {
        this.mapService.setActive(this.object.id);
    }

    onEditClick() {
        this.mapService.editMapObject(this.object, false);
    }
}
