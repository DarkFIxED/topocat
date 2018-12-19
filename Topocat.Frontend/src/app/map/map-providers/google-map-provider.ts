import { MapProvider } from './map-provider';
import { Injectable } from '@angular/core';

@Injectable()
export class GoogleMapProvider implements MapProvider {

    private map: google.maps.Map;

    public drawMarker(args: any): void {
    }

    drawPolygon(args: any): void {
    }

    updateMarker(marker: any): Promise<any> {
        return undefined;
    }

    updatePolygon(polygon: any): Promise<any> {
        return undefined;
    }

    setup(map: any): void {
        this.map = map;
    }

}