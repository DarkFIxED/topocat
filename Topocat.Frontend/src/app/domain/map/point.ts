import { BaseMapObject } from './base-map-object';
import { Coord } from './coord';

export class Point extends BaseMapObject {
    constructor(title: string,
                description: string,
                public coord: Coord) {
        super(title, description);
    }
}
