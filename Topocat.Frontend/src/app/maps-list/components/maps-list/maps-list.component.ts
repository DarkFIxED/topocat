import {Component, OnInit} from '@angular/core';
import {MapsListHttpService} from '../../services/maps-list.http.service';
import {filter, switchMap, tap} from 'rxjs/operators';
import {MapModel} from '../../models/map.model';
import {MatDialog} from '@angular/material';
import {NewMapComponent} from '../new-map/new-map.component';

@Component({
    selector: 'app-maps-list',
    templateUrl: './maps-list.component.html',
    styleUrls: ['./maps-list.component.scss']
})
export class MapsListComponent implements OnInit {

    loading = false;

    displayedColumns: string[] = ['title', 'email', 'management'];
    maps: MapModel[] = [];

    constructor(private mapsListHttpService: MapsListHttpService,
                private dialog: MatDialog) {
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
                if (!result.isSuccessful)
                // TODO: show error
                {
                    throw new Error(result.message);
                }

                this.maps = [...result.data.maps];
            });
    }

    openNewMapDialog() {
        const dialogRef = this.dialog.open(NewMapComponent, {
            width: '250px',
            hasBackdrop: true
        });

        dialogRef.afterClosed()
            .pipe(
                filter(result => !!result),
                switchMap(result => this.mapsListHttpService.createMap(result))
            )
            .subscribe(result => {
                if (result.isSuccessful)
                    this.load();
                else
                    // TODO: handle error
                    throw new Error();
            });
    }
}
