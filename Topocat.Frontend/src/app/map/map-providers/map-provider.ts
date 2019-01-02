import { Place } from '../../domain/map/place';

export interface MapProvider {
    maxZoom: number;
    drawPlace(place: Place): void;
    register();
    unregister();
}