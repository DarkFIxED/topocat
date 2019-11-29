import {Component, Input, OnInit} from '@angular/core';
import {MapObjectModel} from '../../models/map-object.model';
import {environment} from '../../../../environments/environment';
import {WktService} from '../../services/wkt.service';

@Component({
    selector: 'app-general-map-object-properties',
    templateUrl: './general-map-object-properties.component.html',
    styleUrls: ['./general-map-object-properties.component.scss']
})
export class GeneralMapObjectPropertiesComponent implements OnInit {

    environment = environment;
    type: string;

    @Input()
    model: MapObjectModel;

    constructor(private wktService: WktService) {
    }

    ngOnInit() {
        this.type = this.wktService.getWktType(this.model.wktString);
    }

}
