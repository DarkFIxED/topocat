import {Injectable} from '@angular/core';
import * as WKT from 'terraformer-wkt-parser';

@Injectable()
export class WktService {
    getWktType(wktString: string): string {
        const primitive = WKT.parse(wktString);

        return primitive.type;
    }

    getPoint(lat: number, lng: number): string {
        return WKT.convert({
            type: 'Point',
            coordinates: [lat, lng]
        });
    }
}
