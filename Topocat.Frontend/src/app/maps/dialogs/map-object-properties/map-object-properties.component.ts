import {Component, Inject, OnInit} from '@angular/core';
import {MapObjectModel} from '../../models/map-object.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogResult} from '../../../core/models/dialog-result';
import {ShowPropertiesActions} from '../../models/show-properties-actions';
import {ID} from '@datorama/akita';

@Component({
    selector: 'app-map-object-properties',
    templateUrl: './map-object-properties.component.html',
    styleUrls: ['./map-object-properties.component.scss']
})
export class MapObjectPropertiesComponent implements OnInit {

    model: MapObjectModel;
    mapId: string;

    constructor(public dialogRef: MatDialogRef<MapObjectPropertiesComponent, DialogResult<{ result: ShowPropertiesActions, mapObjectId: ID }>>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        const strongTypedData = (data as { model: MapObjectModel, mapId: string });
        this.model = data.model;
        this.mapId = strongTypedData.mapId;
    }

    ngOnInit() {
    }

    onCloseClick() {
        this.dialogRef.close(DialogResult.Ok({result: ShowPropertiesActions.Finished, mapObjectId: this.model.id}));
    }

    onEditClick() {
        this.dialogRef.close(DialogResult.Ok({result: ShowPropertiesActions.EditRequested, mapObjectId: this.model.id}));
    }
}
