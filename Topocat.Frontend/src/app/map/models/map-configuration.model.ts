
export abstract class MapConfigurationModel {

    protected constructor( zoomLevel = 13, maxZoom = 25, minZoom = 10) {
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.zoomLevel = zoomLevel;
    }

    zoomLevel: number;
    maxZoom: number;
    minZoom: number;
}