import {Component, OnInit} from '@angular/core';
import {MapObjectsQuery} from '../../queries/map-objects.query';
import {debounceTime, map} from 'rxjs/operators';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {MapService} from '../../services/map.service';

@Component({
    selector: 'app-objects-list',
    templateUrl: './objects-list.component.html',
    styleUrls: ['./objects-list.component.scss']
})
export class ObjectsListComponent implements OnInit {

    searchString: string = undefined;
    searchSubject = new BehaviorSubject<string>(undefined);
    search$ = this.searchSubject.asObservable().pipe(
        debounceTime(200)
    );

    editing$ = this.mapsQuery.select(state => state.editing.mapObjectId).pipe(
        map(id => !!id)
    );

    adding$ = this.mapsQuery.select(state => state.adding);

    activeId$ = this.mapsQuery.selectActiveId();

    objects$ = combineLatest(this.search$, this.mapsQuery.selectAll())
        .pipe(
            map(results => {
                if (!results[0] || results[0] === '') {
                    return results[1];
                }

                return results[1].filter(object => object.title.toLowerCase().includes(results[0].toLowerCase()));
            })
        );

    totalObjects$ = this.mapsQuery.selectAll();

    loading$ = this.mapsQuery.select(state => state.loading);

    constructor(private mapsQuery: MapObjectsQuery,
                private mapService: MapService) {
    }

    ngOnInit() {
    }

    emitValue() {
        this.searchSubject.next(this.searchString);
    }

    newMapObject() {
        this.mapService.addNewMapObject();
    }
}
