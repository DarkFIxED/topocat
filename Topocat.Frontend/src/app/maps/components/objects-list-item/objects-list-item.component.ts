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

    @Input()
    object: MapObjectModel;

    iconString = '';

    constructor(private mapService: MapService,
                private wktService: WktService) {
    }

    ngOnInit() {
        this.iconString = this.selectIconString();
    }

    onCenterClick() {
        this.mapService.setActive(this.object.id);
    }

    private selectIconString() {
        let icon = 'mdi mdi-';
        const objectType = this.wktService.getWktType(this.object.wktString);

        switch (objectType) {
            case 'Point':
                icon = icon + 'map-marker-outline';
                break;

            case 'LineString':
                icon = icon + 'vector-polyline';
                break;

            case 'Polygon':
                icon = icon + 'vector-polygon';
                break;

            default:
                throw new Error();
        }

        return icon;
    }
}
