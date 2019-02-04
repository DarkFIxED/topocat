import { GoogleAreasHelper } from './google-areas-helper';
import { MapObject } from '../../../domain/map/map-object';
import { GoogleMapDrawnObject } from './google-map-drawn-object';
import { Place } from '../../../domain/map/place';
import { Area } from '../../../domain/map/area';
import { Coords } from '../../../domain/map/coords';
import { GooglePlacesHelper } from './google-places-helper';

export class GoogleObjectsHelper {

    private map: google.maps.Map;
    private markerDrawer = new GooglePlacesHelper();
    private polygonDrawer = new GoogleAreasHelper();

    public setup(map: google.maps.Map) {
        this.map = map;
        this.markerDrawer.setup(map);
        this.polygonDrawer.setup(map);
    }

    draw(object: MapObject): GoogleMapDrawnObject {
        if (object instanceof Place) {
            return this.markerDrawer.draw(<Place>object);
        }
        if (object instanceof Area) {
            return this.polygonDrawer.draw(<Area>object);
        }
    }

    update(drawnObject: GoogleMapDrawnObject, object: MapObject): void {
        if (object instanceof Place) {
            return this.markerDrawer.updateDrawnObject(drawnObject, object);
        }
        if (object instanceof Area) {
            return this.polygonDrawer.updateDrawnObject(drawnObject, object);
        }
    }

    hide(object: GoogleMapDrawnObject): void {
        let mapObject = object.object;

        if (mapObject instanceof google.maps.Marker) {
            (<google.maps.Marker>mapObject).setMap(null);
        }

        if (mapObject instanceof google.maps.Polygon) {
            (<google.maps.Polygon>mapObject).setMap(null);
        }

        if (object.infoWindow) {
            object.infoWindow.close();
        }
    }

    show(object: GoogleMapDrawnObject): void {
        let mapObject = object.object;

        if (mapObject instanceof google.maps.Marker) {
            (<google.maps.Marker>mapObject).setMap(this.map);
        }

        if (mapObject instanceof google.maps.Polygon) {
            (<google.maps.Polygon>mapObject).setMap(this.map);
        }
    }

    addPhantom(object: MapObject): GoogleMapDrawnObject {
        if (object instanceof Place) {
            return this.markerDrawer.createPhantom(object);
        }

        if (object instanceof Area) {
            return this.polygonDrawer.createPhantom(object);
        }
    }

    updatePhantom(drawnObject: GoogleMapDrawnObject, object: MapObject): void {
        if (object instanceof Place) {
            this.markerDrawer.updatePhantom(drawnObject, object);
        }

        if (object instanceof Area) {
            this.polygonDrawer.updatePhantom(drawnObject, object);
        }
    }
}