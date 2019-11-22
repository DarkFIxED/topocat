import {Component, OnInit} from '@angular/core';
import {MapsListHttpService} from '../../services/maps-list.http.service';
import {filter, switchMap, tap} from 'rxjs/operators';
import {MapModel} from '../../models/map.model';
import {MatDialog, MatDialogRef} from '@angular/material';
import {NewMapComponent} from '../new-map/new-map.component';
import {Router} from '@angular/router';
import {DialogResult} from '../../../core/models/dialog-result';
import {NewMapModel} from '../../models/new-map.model';
import {CredentialsStore} from '../../../core/stores/credentials.store';

@Component({
    selector: 'app-maps-list',
    templateUrl: './maps-list.component.html',
    styleUrls: ['./maps-list.component.scss']
})
export class MapsListComponent implements OnInit {

    loading = false;

    displayedColumns: string[] = ['title', 'email', 'management'];
    maps: MapModel[] = [];

    currentUserId: string = undefined;

    constructor(private mapsListHttpService: MapsListHttpService,
                private dialog: MatDialog,
                private router: Router,
                private credentialsStore: CredentialsStore) {

        this.currentUserId = this.credentialsStore.getCurrentUserId();
    }

    ngOnInit() {
        this.load();
    }

    load() {
        this.loading = true;
        this.mapsListHttpService.getMapsList()
            .pipe(
                tap(() => this.loading = false)
            )
            .subscribe(result => {
                // TODO: show error
                if (!result.isSuccessful) {
                    throw new Error(result.message);
                }

                this.maps = [...result.data.maps];
            });
    }

    openNewMapDialog() {

        const newMapModel = {
            title: undefined
        };

        this.openEditDialog(newMapModel, true)
            .afterClosed()
            .pipe(
                filter(dialogResult => !dialogResult.isCancelled),
                switchMap(dialogResult => this.mapsListHttpService.createMap(dialogResult.data))
            )
            .subscribe(result => {
                if (result.isSuccessful) {
                    this.load();
                } else {
                    // TODO: handle error
                    throw new Error();
                }
            });
    }

    redirectToMap(id: string) {
        this.router.navigateByUrl(`/maps/${id}`);
    }

    changeMap(mapModel: MapModel) {
        const editMapModel = {
            title: mapModel.title
        };

        this.openEditDialog(editMapModel, false)
            .afterClosed()
            .pipe(
                filter(dialogResult => !dialogResult.isCancelled),
                switchMap(dialogResult => this.mapsListHttpService.updateMap(mapModel.id, dialogResult.data))
            )
            .subscribe(result => {
                if (result.isSuccessful) {
                    this.load();
                } else {
                    // TODO: handle error
                    throw new Error();
                }
            });
    }

    private openEditDialog(model: NewMapModel, isNewMap: boolean): MatDialogRef<NewMapComponent, DialogResult<NewMapModel>> {
        return this.dialog.open(NewMapComponent, {
            width: '250px',
            hasBackdrop: true,
            data: {model, isNewMap},
            disableClose: true
        });

    }
}
