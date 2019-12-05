import {Component, OnInit} from '@angular/core';
import {MapObjectsService} from '../../services/map-objects.service';

@Component({
    selector: 'app-confirm-drawing',
    templateUrl: './confirm-drawing.component.html',
    styleUrls: ['./confirm-drawing.component.scss']
})
export class ConfirmDrawingComponent implements OnInit {

    constructor(private mapObjectsService: MapObjectsService) {
    }

    ngOnInit() {
    }

    onCancelClick() {
        this.mapObjectsService.stopObjectDrawingProcess(false);
    }

    onOkClick() {
        this.mapObjectsService.stopObjectDrawingProcess(true);
    }
}
