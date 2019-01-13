import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { MessageBusService } from 'litebus';

import { MapService } from '../../services/map.service';
import { MapStore } from '../../stores/map.store';
import { Area } from '../../../domain/map/area';

@Component({
    selector: 'tc-edit-area',
    templateUrl: './edit-area.component.html',
    styleUrls: ['./edit-area.component.scss']
})
export class EditAreaComponent implements OnInit {

    private area: Area;

    public form = new FormGroup({
        title: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        path: new FormArray([])
    });

    public isNewArea = false;

    private listeners = [];

    constructor(private mapService: MapService,
                private mapStore: MapStore,
                private route: ActivatedRoute,
                private router: Router,
                private messageBus: MessageBusService,
                public dialog: MatDialog) {
        this.route.data.subscribe(data => {
            this.isNewArea = !!data.newEntity;

            if (this.isNewArea) {
                this.area = new Area('', '');
            } else {
                this.route.params.subscribe(params => {
                    this.area = this.getCopyOfExistingArea(params['id']);
                });
            }
        });

        this.form.setValue({
            uuid: this.area.uuid,
            title: this.area.title,
            description: this.area.description,
            path: this.area.path
        });
    }

    ngOnInit() {
    }

    private getCopyOfExistingArea(uuid: string) {
        let originArea = <Area>this.mapStore.entity.getObject(uuid);

        if (!originArea) {
            throw new Error('Area not found');
        }

        let area = new Area();
        area.copyFrom(originArea);

        return area;
    }
}
