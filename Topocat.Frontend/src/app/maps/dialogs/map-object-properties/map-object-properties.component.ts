import {Component, Inject, OnInit} from '@angular/core';
import {MapObjectModel} from '../../models/map-object.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogResult} from '../../../core/models/dialog-result';
import {ShowPropertiesActions} from '../../models/show-properties-actions';
import {environment} from '../../../../environments/environment';
import {WktService} from '../../services/wkt.service';

@Component({
    selector: 'app-map-object-properties',
    templateUrl: './map-object-properties.component.html',
    styleUrls: ['./map-object-properties.component.scss']
})
export class MapObjectPropertiesComponent implements OnInit {

    environment = environment;

    model: MapObjectModel = undefined;
    type: string;
    constructor(public dialogRef: MatDialogRef<MapObjectPropertiesComponent, DialogResult<{ result: ShowPropertiesActions }>>,
                @Inject(MAT_DIALOG_DATA) data: any,
                private wktService: WktService) {

        this.model = (data as { model: MapObjectModel }).model;
        this.type = this.wktService.getWktType(this.model.wktString);
    }

    ngOnInit() {
    }

    onCloseClick() {
        this.dialogRef.close(DialogResult.Ok({result: ShowPropertiesActions.Finished}));
    }

    onEditClick() {
        this.dialogRef.close(DialogResult.Ok({result: ShowPropertiesActions.EditRequested}));
    }
}
