import { MapConfigurationModel } from './map-configuration.model';
import { ControlPosition, MapTypeId, ZoomControlStyle } from '@agm/core/services/google-maps-types';
import { Coord } from '../../domain/map/coord';

export class GoogleMapConfigurationModel extends MapConfigurationModel {

    public mapTypeControl: boolean;
    public scaleControl: boolean;
    public zoomControlOptions: {
        style?: ZoomControlStyle,
        position?: ControlPosition
    };
    public mapTypeId: MapTypeId;

    public constructor(coord = new Coord(56, 84),
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
        super(coord, zoomLevel, maxZoom, minZoom);
        this.mapTypeControl = mapTypeControl;
        this.scaleControl = scaleControl;
        this.zoomControlOptions = zoomControlOptions;
        this.mapTypeId = mapTypeId;
    }
}