import { Area } from '../../../domain/map/area';
import { GoogleMapDrawnObject } from './google-map-drawn-object';
import { PhantomAreaPathChangedEventArgs } from '../../models/phantom-area-path-changed-event-args';
import { Coords } from '../../../domain/map/coords';

export class GoogleAreasHelper {

    private map: google.maps.Map;

    setup(map: google.maps.Map) {
        this.map = map;
    }

    draw(object: Area): GoogleMapDrawnObject {
        let drawnObject =  this.areaToGoogleMapDrawnObjectMapping(object);

        object.changed.subscribe(() => {
            this.updateDrawnObject(drawnObject, object);
        });

        return drawnObject;
    }

    createPhantom(area: Area): GoogleMapDrawnObject {
        let drawnObject = this.areaToGoogleMapDrawnObjectMapping(area, true);

        let polygon = <google.maps.Polygon>drawnObject.object;

        polygon.addListener('dragend', this.onPolygonDrag(drawnObject));
        polygon.addListener('updated', this.onPolygonDrag(drawnObject));

        this.setPolygonPathListeners(drawnObject);

        return drawnObject;
    }

    updatePhantom(drawnObject: GoogleMapDrawnObject, object: Area) {
        this.updateDrawnObject(drawnObject, object);

        this.setPolygonPathListeners(drawnObject);
    }

    updateDrawnObject(drawnObject: GoogleMapDrawnObject, object: Area) {
        if (drawnObject.infoWindow) {
            drawnObject.infoWindow.setContent(`${object.title}: ${object.description}`);
        }

        let newPathValue = object.path.coords.map(coord => coord.getLatLng());

        let polygon = (<google.maps.Polygon>drawnObject.object);

        polygon.getPath().unbindAll();

        polygon.setPath(newPathValue);
    }

    private areaToGoogleMapDrawnObjectMapping = (area: Area, isPhantom = false): GoogleMapDrawnObject => {
        let infoWindow = new google.maps.InfoWindow({
            content: `${area.title}: ${area.description}`
        });

        let pathValue = area.path.coords.map(coord => coord.getLatLng());

        let polygon = new google.maps.Polygon({
            fillOpacity: isPhantom ? 0.2 : 0.5,
            strokeOpacity: isPhantom ? 0.4 : 1,
            paths: [pathValue],
            editable: isPhantom,
            draggable: isPhantom,
            clickable: true,
            map: this.map
        });

        polygon.addListener('click', function () {
            let bounds = new google.maps.LatLngBounds();
            polygon.getPath().getArray().forEach(value => bounds.extend(value));
            let center = bounds.getCenter();

            let marker = new google.maps.Marker({
                position: center,
                map: polygon.getMap(),
                opacity: 0
            });

            infoWindow.open(polygon.getMap(), marker);
        });

        return new GoogleMapDrawnObject(area.uuid, polygon, infoWindow);
    };

    private setPolygonPathListeners(polygonPhantom: GoogleMapDrawnObject) {
        let polygon = (<google.maps.Polygon>polygonPhantom.object);
        let path = polygon.getPath();

        path.addListener('insert_at', this.onPolygonDrag(polygonPhantom));
        path.addListener('remove_at', this.onRemovedInPhantomPolygonPath(polygonPhantom));
        path.addListener('set_at', this.onPolygonDrag(polygonPhantom));

        polygon.notify('updated');
    }

    private onPolygonDrag = function (drawnObject: GoogleMapDrawnObject) {
        return function () {
            let polygon = <google.maps.Polygon>drawnObject.object;
            let path = polygon.getPath().getArray().map(latLng => {
                return new Coords(latLng.lat(), latLng.lng());
            });

            let payload = new PhantomAreaPathChangedEventArgs(drawnObject.uuid, path);

            drawnObject.coordsChanged.next(payload);
        };
    };

    private onRemovedInPhantomPolygonPath = function (drawnObject: GoogleMapDrawnObject) {
        return function (index: number) {
            let polygon = <google.maps.Polygon>drawnObject.object;
            let path = polygon.getPath().getArray().map(latLng => {
                return new Coords(latLng.lat(), latLng.lng());
            });

            path.splice(index, 1);

            let payload = new PhantomAreaPathChangedEventArgs(drawnObject.uuid, path);

            drawnObject.coordsChanged.next(payload);
        };
    };
}