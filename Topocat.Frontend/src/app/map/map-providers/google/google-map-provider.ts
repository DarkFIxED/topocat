import { Injectable } from '@angular/core';
import { MapsEventListener } from '@agm/core/services/google-maps-types';
import { MessageBusService } from '../../infrastructure/message-bus/message-bus.service';
import { Place } from '../../domain/map/place';
import { Message } from '../../infrastructure/message-bus/message';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleMapProvider {

    private map: google.maps.Map;
    private drawingManager: google.maps.drawing.DrawingManager;
    private onPolygonCompleteListener: MapsEventListener;
    private onMarkerCompleteListener: MapsEventListener;
    private cancelDrawingShape = false;
    private isDrawingNow = false;
    private drawnObjects = {};

    constructor(private messageBus: MessageBusService) {

    }

    setup(map: any): void {
        this.map = map;

        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.MARKER,
            drawingControl: false,
            drawingControlOptions: {
                drawingModes: [
                    google.maps.drawing.OverlayType.MARKER,
                    google.maps.drawing.OverlayType.POLYGON
                ]
            }
        });

        this.messageBus.listen(['MAP_PLACE_ADDED'],
            (observable: Observable<Message<Place>>) => {
                return observable.subscribe(message => this.drawPlace(message.payload));
            });

        this.map.addListener()

    }

    public drawPlace(place: Place): void {
        this.assertMapReady();

        let marker = new google.maps.Marker();
        marker.setPosition({lat: place.coords.lat, lng: place.coords.lng});
        marker.setMap(this.map);

        this.drawnObjects[place.uuid] = marker;
    }

    private assertMapReady() {
        if (!this.map) {
            throw new Error('Map is not ready');
        }
    }


    // public drawMarker(point: Point, args: any): Promise<Point> {
    //     if (this.isDrawingNow) {
    //         this.cancel();
    //     } else {
    //         this.isDrawingNow = true;
    //     }
    //
    //     return new Promise<any>((resolve, reject) => {
    //         this.drawingManager.setMap(this.map);
    //         this.drawingManager.setOptions({markerOptions: args});
    //         this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.MARKER);
    //
    //         let onMarkerCompleteHandler = function (service: GoogleMapProvider) {
    //             return function (marker: google.maps.Marker) {
    //                 service.isDrawingNow = false;
    //
    //                 if (service.cancelDrawingShape) {
    //                     service.cancelDrawingShape = false;
    //                     marker.setMap(null);
    //
    //                     reject();
    //                 } else {
    //                     point.coord = new Coord(marker.getPosition().lat(), marker.getPosition().lng());
    //                     service.drawnObjects[point.id] = marker;
    //                     resolve(marker);
    //                 }
    //
    //                 service.drawingManager.setDrawingMode(null);
    //                 service.onMarkerCompleteListener.remove();
    //             }
    //         };
    //
    //         this.onMarkerCompleteListener = google.maps.event.addListener(this.drawingManager, 'markercomplete', onMarkerCompleteHandler(this));
    //     });
    //
    // }
    //
    // drawPolygon(area: Area, args: any): Promise<Area> {
    //     if (this.isDrawingNow) {
    //         this.cancel();
    //     } else {
    //         this.isDrawingNow = true;
    //     }
    //
    //     return new Promise<any>((resolve, reject) => {
    //         this.drawingManager.setMap(this.map);
    //         this.drawingManager.setOptions({polygonOptions: args});
    //         this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    //
    //         let onPolygonCompleteHandler = function (service: GoogleMapProvider) {
    //             return function (polygon: google.maps.Polygon) {
    //                 service.isDrawingNow = false;
    //
    //                 if (service.cancelDrawingShape) {
    //                     service.cancelDrawingShape = false;
    //                     polygon.setMap(null);
    //
    //                     reject();
    //                 } else {
    //                     //area.coords = polygon.getPath().getArray().map(latLng => new Coord(latLng.lat(), latLng.lng()));
    //                     // service.drawnObjects[area.id] = polygon;
    //                     resolve(polygon);
    //                 }
    //
    //                 service.drawingManager.setDrawingMode(null);
    //                 service.onPolygonCompleteListener.remove();
    //             }
    //         };
    //
    //         this.onPolygonCompleteListener = google.maps.event.addListener(this.drawingManager, 'polygoncomplete', onPolygonCompleteHandler(this));
    //     });
    // }
    //
    // updateMarker(marker: any): Promise<any> {
    //     return undefined;
    // }
    //
    // updatePolygon(polygon: any): Promise<any> {
    //     return undefined;
    // }

    //


    //
    // public cancel() {
    //     this.cancelDrawingShape = true;
    //     this.drawingManager.setDrawingMode(null);
    // }

}