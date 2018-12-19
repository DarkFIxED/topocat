import { Coord } from '../../domain/map/coord';

export abstract class MapConfigurationModel {

    protected constructor(coord = new Coord(84, 56), zoomLevel = 13, maxZoom = 25, minZoom = 10) {
        this.coord = coord;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.zoomLevel = zoomLevel;
    }

    public coord: Coord;
    public zoomLevel: number;
    public maxZoom: number;
    public minZoom: number;
}