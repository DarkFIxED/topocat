import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';

@Component({
    selector: 'app-confirm-drawing',
    templateUrl: './confirm-drawing.component.html',
    styleUrls: ['./confirm-drawing.component.scss']
})
export class ConfirmDrawingComponent implements OnInit {

    constructor(private mapService: MapService) {
    }

    ngOnInit() {
    }

    onCancelClick() {
        this.mapService.stopDrawing(false);
    }

    onOkClick() {
        this.mapService.stopDrawing(true);
    }
}
