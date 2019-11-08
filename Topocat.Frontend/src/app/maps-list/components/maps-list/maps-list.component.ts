import {Component, OnInit} from '@angular/core';
import {MapsListHttpService} from '../../services/maps-list.http.service';
import {tap} from 'rxjs/operators';
import {MapModel} from '../../models/map.model';

@Component({
    selector: 'app-maps-list',
    templateUrl: './maps-list.component.html',
    styleUrls: ['./maps-list.component.scss']
})
export class MapsListComponent implements OnInit {

    loading = false;

    displayedColumns: string[] = ['title', 'email', 'management'];
    maps: MapModel[] = [];

    constructor(private mapsListHttpService: MapsListHttpService) {
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
                   throw new Error(result.message);

               this.maps = [...result.data.maps];
            });
    }

}
