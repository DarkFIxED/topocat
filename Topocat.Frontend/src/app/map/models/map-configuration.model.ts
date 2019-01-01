
export abstract class MapConfigurationModel {

    protected constructor( zoomLevel = 13, maxZoom = 25, minZoom = 10) {
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
        this.zoomLevel = zoomLevel;
    }

    public zoomLevel: number;
    public maxZoom: number;
    public minZoom: number;
}