export interface MapProvider {

    setup(map: any): void;

    drawMarker(args: any): void;

    drawPolygon(args: any): void;

    updateMarker(marker: any): Promise<any>;

    updatePolygon(polygon: any): Promise<any>;
}
