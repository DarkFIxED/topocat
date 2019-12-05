import {Component, OnInit} from '@angular/core';
import {MapObjectsQuery} from '../../queries/map-objects.query';
import {debounceTime, map, tap} from 'rxjs/operators';
import {combineLatest} from 'rxjs';
import {MapObjectsService} from '../../services/map-objects.service';

@Component({
    selector: 'app-objects-list',
    templateUrl: './objects-list.component.html',
    styleUrls: ['./objects-list.component.scss']
})
export class ObjectsListComponent implements OnInit {

    searchString: string = undefined;

    search$ = this.mapsQuery.ui.select(state => state.searchString);

    editing$ = this.mapsQuery.select(state => state.editing.mapObjectId).pipe(
        map(id => !!id)
    );

    adding$ = this.mapsQuery.select(state => state.adding);

    activeId$ = this.mapsQuery.selectActiveId();

    objects$ = combineLatest(this.search$, this.mapsQuery.selectAll())
        .pipe(
            tap(results => {
                if (this.searchString !== results[0]) {
                    this.searchString = results[0];
                }
            }),
            debounceTime(200),
            map(results => {

                const searchString = results[0];
                const mapObjects = results[1];

                if (!searchString || searchString === '') {
                    return mapObjects;
                }

                if (searchString.startsWith('#')) {
                    const pureTag = searchString.substring(1, searchString.length).toLowerCase();
                    return mapObjects.filter(object => object.tags.some(tag => tag.toLowerCase().startsWith(pureTag)));
                } else {
                    return mapObjects.filter(object => object.title.toLowerCase().includes(searchString.toLowerCase()));
                }
            })
        );

    totalObjects$ = this.mapsQuery.selectAll();

    loading$ = this.mapsQuery.select(state => state.loading);

    constructor(private mapsQuery: MapObjectsQuery,
                private mapObjectsService: MapObjectsService) {
    }

    ngOnInit() {
    }

    emitValue() {
        this.mapObjectsService.setSearchString(this.searchString);
    }

    newMapObject() {
        this.mapObjectsService.startAddingMapObjectProcess();
    }
}
