import {ID} from '@datorama/akita';

export class MapObjectModel {

    id: ID;
    title: string;
    description: string;
    createdAt: Date;
    lastModifiedAt: Date;
    wktString: string;
    tags: string[];
}
