import {Observable} from 'rxjs';
import {Coordinates} from '../../core/models/coordinates';
import {UnifiedMapObject} from '../models/unified-map-object';
import {BaseDestroyable} from '../../core/services/base-destroyable';
import {MapObjectModel} from '../models/map-object.model';
import {SupportedMapTypes} from '../models/supported-map-types';

export abstract class MapProvider extends BaseDestroyable {

    position$: Observable<Coordinates>;
    zoom$: Observable<number>;
    infoWindowClosed$: Observable<any>;
    onDetailsOpenRequired$: Observable<string>;

    abstract getType(): SupportedMapTypes;

    abstract getAvailableMapModes(): {title: string, value: string}[];

    abstract getMapMode(): string;

    abstract setMapMode(mode: string);

    abstract panTo(coords: Coordinates, zoom: number);

    abstract openInfoWindow(mapObject: MapObjectModel, unifiedMapObject: UnifiedMapObject);

    abstract closeInfoWindow();

    abstract drawFigure(type: string): Promise<Coordinates | Coordinates[] | Coordinates[][]>;
}
