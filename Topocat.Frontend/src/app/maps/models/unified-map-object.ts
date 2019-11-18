import {ID} from '@datorama/akita';
import {MapObjectModel} from './map-object.model';
import {Observable} from 'rxjs';
import {Coordinates} from '../../core/models/coordinates';

export interface UnifiedMapObject {
    id: ID;

    click$: Observable<ID>;
    drag$: Observable<Coordinates | Coordinates[] | Coordinates[][]>;

    dispose();

    update(object: MapObjectModel);

    getInfoWindowPosition(): Coordinates;

    disable();

    enable();

    allowChange();

    disallowChange();
}
