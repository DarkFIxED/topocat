import { MapConfigurationModel } from './map-configuration.model';
import { ControlPosition, MapTypeId, ZoomControlStyle } from '@agm/core/services/google-maps-types';


export class GoogleMapConfigurationModel extends MapConfigurationModel {

    mapTypeControl: boolean;
    scaleControl: boolean;
    zoomControlOptions: {
        style?: ZoomControlStyle,
        position?: ControlPosition
    };
    mapTypeId: MapTypeId;

    constructor(//coord = new Coord(56, 84),
                       zoomLevel = 10,
                       maxZoom = 25,
                       minZoom = 2,
                       mapTypeId = MapTypeId.HYBRID,
                       mapTypeControl = true,
                       scaleControl = true,
                       zoomControlOptions = {
                           style: ZoomControlStyle.SMALL,
                           position: ControlPosition.BOTTOM_RIGHT
                       }) {
        super(zoomLevel, maxZoom, minZoom);
        this.mapTypeControl = mapTypeControl;
        this.scaleControl = scaleControl;
        this.zoomControlOptions = zoomControlOptions;
        this.mapTypeId = mapTypeId;
    }
}