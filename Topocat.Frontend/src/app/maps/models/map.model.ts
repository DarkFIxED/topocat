import {ID} from '@datorama/akita';
import {UserModel} from '../../maps-list/models/user.model';

export class MapModel {
    id: ID;
    title: string;
    createdAt: Date;
    lastModifiedAt: Date;
    createdBy: UserModel
}
