import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

    constructor(private mapService: MapService,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            if (!params.id)
                throw new Error();

            this.mapService.load(params.id);
        });
    }

}
