import { Place } from '../../../domain/map/place';
import { GoogleMapDrawnObject } from './google-map-drawn-object';
import { PhantomPlaceCoordsChangedEventArgs } from '../../models/phantom-place-coords-changed-event-args';

export class GooglePlacesHelper {

    private map: google.maps.Map;

    setup(map: google.maps.Map) {
        this.map = map;
    }

    draw(object: Place): GoogleMapDrawnObject {
        let drawnObject = this.placeToGoogleMapDrawnObjectMapping(object);

        object.changed.subscribe(() => {
            this.updateDrawnObject(drawnObject, object);
        });

        return drawnObject;
    }

    createPhantom(place: Place): GoogleMapDrawnObject {
        return this.placeToGoogleMapDrawnObjectMapping(place, true);
    }

    updatePhantom(phantom: GoogleMapDrawnObject, place: Place): void {
       this.updateDrawnObject(phantom, place);
    }

    updateDrawnObject(drawnObject: GoogleMapDrawnObject, object: Place) {
        if (drawnObject.infoWindow) {
            drawnObject.infoWindow.setContent(object.description);
        }

        (<google.maps.Marker>drawnObject.object).setOptions({
            label: object.title,
            position: object.coords
        });
    }

    private placeToGoogleMapDrawnObjectMapping = (place: Place, isPhantom = false): GoogleMapDrawnObject => {
        let infoWindow = new google.maps.InfoWindow({
            content: place.description
        });

        let marker = new google.maps.Marker({
            label: place.title,
            opacity: isPhantom ? 0.4 : 1,
            position: place.coords.getLatLng(),
            draggable: isPhantom,
            map: this.map
        });

        marker.addListener('click', function () {
            infoWindow.open(marker.getMap(), marker);
        });

        let drawnObject =  new GoogleMapDrawnObject(place.uuid, marker, infoWindow);

        let onPhantomDragListener = function(drawnObject: GoogleMapDrawnObject) {
            return function (event: google.maps.MouseEvent) {
                let payload = new PhantomPlaceCoordsChangedEventArgs(drawnObject.uuid, event.latLng.lat(), event.latLng.lng());
                drawnObject.coordsChanged.next(payload);
            };
        };

        marker.addListener('drag', onPhantomDragListener(drawnObject));

        return drawnObject;
    };
}

