import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class MapInstanceService {
    private mapInstance = new BehaviorSubject<google.maps.Map>(undefined);
    mapInstance$ = this.mapInstance.asObservable();

    setInstance(instance: google.maps.Map) {
        this.mapInstance.next(instance);
    }
}
