import { BaseMapObject } from './base-map-object';
import { Coord } from './coord';

export class Area extends BaseMapObject {
    constructor(title: string,
                description: string,
                public coords: Coord[]) {
        super(title, description);
    }
}
