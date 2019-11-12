import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';
import {Observable} from 'rxjs';

export interface UnifiedMapObject {
    id: ID;

    click$: Observable<ID>;

    clear();

    update(object: MapObjectModel);

    getInfoWindowPosition(): {lat: number, lng: number};
}
