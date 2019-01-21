import { Subject } from 'rxjs';

export class GoogleMapDrawnObject {

    public coordsChanged = new Subject<any>();

    public constructor(public uuid: string,
                       public object: google.maps.Marker | google.maps.Polygon,
                       public infoWindow?: google.maps.InfoWindow) {

    }
}