import { Subject } from 'rxjs';

export class GoogleMapDrawnObject {

    coordsChanged = new Subject<any>();

    constructor(public uuid: string,
                       public object: google.maps.Marker | google.maps.Polygon,
                       public infoWindow?: google.maps.InfoWindow) {

    }
}