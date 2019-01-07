export class GoogleMapDrawnObject {
    public constructor(public uuid: string,
                       public object: google.maps.Marker | google.maps.Polygon,
                       public infoWindow?: google.maps.InfoWindow) {

    }
}