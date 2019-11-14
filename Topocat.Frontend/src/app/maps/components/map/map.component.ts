import {Component, OnInit} from '@angular/core';
import {MapService} from '../../services/map.service';
import {ActivatedRoute} from '@angular/router';
import {MapObjectsDrawer} from '../../services/map-objects.drawer';
import {MapsSignalRService} from '../../services/maps.signal-r.service';
import {filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MapObjectsQuery} from '../../queries/map-objects.query';
import {MatDialog} from '@angular/material';
import {EditMapObjectComponent} from '../../dialogs/edit-map-object/edit-map-object.component';
import {MapsHttpService} from '../../services/maps.http.service';
import {BaseComponent} from '../../../core/components/base.component';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    providers: [MapObjectsDrawer]
})
export class MapComponent extends BaseComponent implements OnInit {

    private mapId: string = undefined;

    constructor(private mapService: MapService,
                private route: ActivatedRoute,
                private mapObjectsDrawer: MapObjectsDrawer,
                private mapObjectsQuery: MapObjectsQuery,
                private mapsSignalRService: MapsSignalRService,
                private matDialog: MatDialog,
                private mapsHttpService: MapsHttpService) {
        super();
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.mapId = params.id;

            if (!this.mapId) {
                throw new Error();
            }

            this.mapService.load(this.mapId);
            this.mapsSignalRService.isConnected$.pipe(
                filter(isConnected => !!isConnected),
                tap(() => this.mapsSignalRService.initialize(this.mapId))
            ).subscribe();
        });

        this.initializeObjectsEdit();
    }

    onMapReady(mapInstance: google.maps.Map) {
        this.mapObjectsDrawer.setMap(mapInstance);
    }

    private initializeObjectsEdit() {
        this.mapObjectsQuery.select(state => state.ui.editingObjectId)
            .pipe(
                filter(id => !!id),
                map(id => this.mapObjectsQuery.getEntity(id)),
                switchMap(model => this.matDialog.open(EditMapObjectComponent, {
                    width: '250px',
                    hasBackdrop: true,
                    data: model
                }).afterClosed()),
                tap(() => this.mapService.resetEditingMapObject()),
                filter(result => !!result),
                switchMap(result => this.mapsHttpService.updateMapObject(this.mapId, result)),
                takeUntil(this.componentAlive$)
            )
            .subscribe();

        this.mapsSignalRService.objectUpdated$.pipe(
            tap(model => this.mapService.updateObject(model)),
            takeUntil(this.componentAlive$)
        )
        .subscribe();
    }
}
